import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAccount, useWalletClient } from "wagmi";
import { toast } from "sonner";
import { contractService } from "@/services/contractServiceV2";
import {
  ShoppingCart,
  Eye,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Wallet,
  Filter,
  Search,
  ArrowUpDown,
  X,
} from "lucide-react";

interface InvoiceData {
  tokenId: string;
  amount: string;
  dueDate: number;
  description: string;
  issuerName: string;
  payerName: string;
  invoiceNumber: string;
  isPaid: boolean;
  isListed: boolean;
  listingPrice?: string;
  seller?: string;
}

export const InvoiceMarketplace = () => {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"amount" | "dueDate" | "recent">(
    "recent"
  );
  const [filterStatus, setFilterStatus] = useState<
    "all" | "available" | "paid"
  >("all");
  const [purchasing, setPurchasing] = useState<string>("");
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(
    null
  );
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const loadMarketplaceInvoices = useCallback(async () => {
    if (!isConnected || !walletClient) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Get all invoices from marketplace
      const marketplaceInvoices =
        await contractService.getMarketplaceListings();
      console.log("Loaded marketplace invoices:", marketplaceInvoices);

      setInvoices(marketplaceInvoices);
    } catch (error) {
      console.error("Error loading marketplace invoices:", error);
      toast.error("Failed to load marketplace invoices");
    } finally {
      setLoading(false);
    }
  }, [isConnected, walletClient]);

  useEffect(() => {
    loadMarketplaceInvoices();
  }, [loadMarketplaceInvoices]);

  const handlePurchaseInvoice = async (tokenId: string, price: string) => {
    if (!isConnected || !walletClient) {
      toast.error("Please connect your wallet");
      return;
    }

    setPurchasing(tokenId);

    try {
      console.log(`Purchasing invoice ${tokenId} for ${price} ETH`);

      const txHash = await contractService.purchaseInvoice(tokenId, price);

      console.log("Purchase successful:", txHash);
      toast.success("Invoice purchased successfully!");

      // Reload marketplace
      await loadMarketplaceInvoices();
    } catch (error: unknown) {
      console.error("Error purchasing invoice:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to purchase invoice: ${errorMessage}`);
    } finally {
      setPurchasing("");
    }
  };

  const handleViewDetails = (invoice: InvoiceData) => {
    setSelectedInvoice(invoice);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedInvoice(null);
  };

  const filteredAndSortedInvoices = invoices
    .filter((invoice) => {
      // Search filter
      const searchMatch =
        !searchTerm ||
        invoice.invoiceNumber
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        invoice.issuerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.payerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const statusMatch =
        filterStatus === "all" ||
        (filterStatus === "available" && !invoice.isPaid && invoice.isListed) ||
        (filterStatus === "paid" && invoice.isPaid);

      return searchMatch && statusMatch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "amount":
          return Number(b.amount) - Number(a.amount);
        case "dueDate":
          return a.dueDate - b.dueDate;
        case "recent":
        default:
          return Number(b.tokenId) - Number(a.tokenId);
      }
    });

  // Debug logging for search functionality
  console.log("Search term:", searchTerm);
  console.log("Total invoices:", invoices.length);
  console.log("Filtered invoices:", filteredAndSortedInvoices.length);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const getDaysUntilDue = (timestamp: number) => {
    const days = Math.ceil(
      (timestamp * 1000 - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return days;
  };

  const getDiscountPercentage = (
    originalAmount: string,
    listingPrice: string
  ) => {
    const original = Number(originalAmount);
    const listing = Number(listingPrice);
    return Math.round(((original - listing) / original) * 100);
  };

  if (!isConnected) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <Wallet className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="text-lg font-medium">Connect Your Wallet</h3>
            <p className="text-muted-foreground">
              Please connect your wallet to browse and purchase invoices
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5" />
            <span>Invoice Marketplace</span>
          </CardTitle>
          <p className="text-muted-foreground">
            Buy and sell tokenized invoices on the blockchain
          </p>
        </CardHeader>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by company or invoice ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="recent">Most Recent</option>
                <option value="amount">Highest Amount</option>
                <option value="dueDate">Due Date</option>
              </select>
            </div>

            {/* Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Invoices</option>
                <option value="available">Available</option>
                <option value="paid">Paid</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Marketplace Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Volume</p>
                <p className="text-lg font-semibold">
                  {invoices
                    .reduce((sum, inv) => sum + Number(inv.amount || 0), 0)
                    .toFixed(3)}{" "}
                  ETH
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-lg font-semibold">
                  {invoices.filter((inv) => !inv.isPaid && inv.isListed).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Invoices</p>
                <p className="text-lg font-semibold">{invoices.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Results Counter */}
      {searchTerm && (
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Search results for "{searchTerm}":{" "}
                  {filteredAndSortedInvoices.length} invoices found
                </span>
              </div>
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm("")}
                  className="text-xs"
                >
                  Clear search
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invoice Listings */}
      {loading ? (
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading marketplace...</span>
          </CardContent>
        </Card>
      ) : filteredAndSortedInvoices.length === 0 ? (
        <Card>
          <CardContent className="text-center p-8">
            <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Invoices Found</h3>
            <p className="text-muted-foreground">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filters"
                : "No invoices are currently available in the marketplace"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedInvoices.map((invoice) => (
            <Card key={invoice.tokenId} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {invoice.invoiceNumber}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {invoice.issuerName}
                    </p>
                  </div>
                  <Badge
                    variant={
                      invoice.isPaid
                        ? "default"
                        : invoice.isListed
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {invoice.isPaid
                      ? "Paid"
                      : invoice.isListed
                      ? "Listed"
                      : "Unlisted"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-medium">{invoice.amount} ETH</span>
                  </div>

                  {invoice.listingPrice && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Listed at:</span>
                      <div className="text-right">
                        <span className="font-medium text-green-600">
                          {invoice.listingPrice} ETH
                        </span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {getDiscountPercentage(
                            invoice.amount,
                            invoice.listingPrice
                          )}
                          % off
                        </Badge>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Due Date:</span>
                    <div className="text-right">
                      <span className="font-medium">
                        {formatDate(invoice.dueDate)}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {getDaysUntilDue(invoice.dueDate)} days
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Payer:</span>
                    <span className="font-medium">{invoice.payerName}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-sm font-medium">Description:</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {invoice.description}
                  </p>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleViewDetails(invoice)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Details
                  </Button>

                  {invoice.isListed &&
                    !invoice.isPaid &&
                    invoice.listingPrice && (
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() =>
                          handlePurchaseInvoice(
                            invoice.tokenId,
                            invoice.listingPrice!
                          )
                        }
                        disabled={purchasing === invoice.tokenId}
                      >
                        {purchasing === invoice.tokenId ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        ) : (
                          <ShoppingCart className="h-4 w-4 mr-1" />
                        )}
                        Buy
                      </Button>
                    )}
                </div>

                {invoice.seller && invoice.seller !== address && (
                  <div className="flex items-center space-x-1 p-2 bg-muted/30 rounded text-xs">
                    <AlertCircle className="h-3 w-3" />
                    <span>
                      Sold by: {invoice.seller.slice(0, 6)}...
                      {invoice.seller.slice(-4)}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Invoice Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>Invoice Details</span>
            </DialogTitle>
          </DialogHeader>

          {selectedInvoice && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-lg">
                    {selectedInvoice.invoiceNumber}
                  </h3>
                  <p className="text-muted-foreground">
                    {selectedInvoice.issuerName} → {selectedInvoice.payerName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">
                    {selectedInvoice.amount} ETH
                  </p>
                  {selectedInvoice.listingPrice && (
                    <p className="text-sm text-green-600">
                      Listed for {selectedInvoice.listingPrice} ETH
                      {selectedInvoice.listingPrice !==
                        selectedInvoice.amount && (
                        <span className="ml-1">
                          (
                          {Math.round(
                            ((Number(selectedInvoice.amount) -
                              Number(selectedInvoice.listingPrice)) /
                              Number(selectedInvoice.amount)) *
                              100
                          )}
                          % discount)
                        </span>
                      )}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Invoice Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Token ID:</span>
                        <span>{selectedInvoice.tokenId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Due Date:</span>
                        <span>
                          {new Date(
                            selectedInvoice.dueDate * 1000
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Days Until Due:
                        </span>
                        <span>
                          {Math.ceil(
                            (selectedInvoice.dueDate * 1000 - Date.now()) /
                              (1000 * 60 * 60 * 24)
                          )}{" "}
                          days
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge
                          variant={
                            selectedInvoice.isPaid ? "default" : "secondary"
                          }
                        >
                          {selectedInvoice.isPaid ? "Paid" : "Unpaid"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {selectedInvoice.seller && (
                    <div>
                      <h4 className="font-medium mb-2">Seller Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Seller Address:
                          </span>
                          <span className="font-mono">
                            {selectedInvoice.seller.slice(0, 10)}...
                            {selectedInvoice.seller.slice(-8)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedInvoice.description}
                    </p>
                  </div>

                  {/* Investment Metrics */}
                  <div>
                    <h4 className="font-medium mb-2">Investment Metrics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Potential ROI:
                        </span>
                        <span className="text-green-600 font-medium">
                          {selectedInvoice.listingPrice
                            ? `${(
                                ((Number(selectedInvoice.amount) -
                                  Number(selectedInvoice.listingPrice)) /
                                  Number(selectedInvoice.listingPrice)) *
                                100
                              ).toFixed(1)}%`
                            : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Time to Maturity:
                        </span>
                        <span>
                          {Math.ceil(
                            (selectedInvoice.dueDate * 1000 - Date.now()) /
                              (1000 * 60 * 60 * 24)
                          )}{" "}
                          days
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={closeDetailsModal}
                  className="flex-1"
                >
                  Close
                </Button>
                {selectedInvoice.isListed &&
                  !selectedInvoice.isPaid &&
                  selectedInvoice.listingPrice && (
                    <Button
                      className="flex-1"
                      onClick={() => {
                        handlePurchaseInvoice(
                          selectedInvoice.tokenId,
                          selectedInvoice.listingPrice!
                        );
                        closeDetailsModal();
                      }}
                      disabled={purchasing === selectedInvoice.tokenId}
                    >
                      {purchasing === selectedInvoice.tokenId ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <ShoppingCart className="h-4 w-4 mr-2" />
                      )}
                      Invest Now - {selectedInvoice.listingPrice} ETH
                    </Button>
                  )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
