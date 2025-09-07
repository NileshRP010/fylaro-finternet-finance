import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAccount, useWalletClient } from "wagmi";
import { toast } from "sonner";
import { contractService } from "@/services/contractServiceV2";
import {
  FileText,
  DollarSign,
  Calendar,
  ShoppingCart,
  Eye,
  Edit,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Wallet,
  Tag,
  TrendingUp,
  Users,
  Clock,
} from "lucide-react";

interface UserInvoice {
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
  createdAt?: number;
}

export const MyInvoices = () => {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const [userInvoices, setUserInvoices] = useState<UserInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [listingInvoice, setListingInvoice] = useState<string>("");
  const [listingPrice, setListingPrice] = useState<string>("");
  const [showListingModal, setShowListingModal] = useState<string>("");

  const loadUserInvoices = useCallback(async () => {
    if (!isConnected || !walletClient || !address) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Get user's invoices
      const invoices = await contractService.getUserInvoices(address);
      console.log("Loaded user invoices:", invoices);

      setUserInvoices(invoices);
    } catch (error) {
      console.error("Error loading user invoices:", error);
      toast.error("Failed to load your invoices");
    } finally {
      setLoading(false);
    }
  }, [isConnected, walletClient, address]);

  useEffect(() => {
    loadUserInvoices();
  }, [loadUserInvoices]);

  const handleListInvoice = async (tokenId: string) => {
    if (!listingPrice || Number(listingPrice) <= 0) {
      toast.error("Please enter a valid listing price");
      return;
    }

    setListingInvoice(tokenId);

    try {
      console.log(`Listing invoice ${tokenId} for ${listingPrice} ETH`);

      const txHash = await contractService.listInvoiceForSale(
        tokenId,
        listingPrice
      );

      console.log("Listing successful:", txHash);
      toast.success("Invoice listed for sale successfully!");

      // Reset state and reload
      setShowListingModal("");
      setListingPrice("");
      await loadUserInvoices();
    } catch (error: unknown) {
      console.error("Error listing invoice:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to list invoice: ${errorMessage}`);
    } finally {
      setListingInvoice("");
    }
  };

  const handleMarkAsPaid = async (tokenId: string) => {
    try {
      console.log(`Marking invoice ${tokenId} as paid`);

      const txHash = await contractService.markInvoiceAsPaid(tokenId);

      console.log("Payment marking successful:", txHash);
      toast.success("Invoice marked as paid successfully!");

      await loadUserInvoices();
    } catch (error: unknown) {
      console.error("Error marking invoice as paid:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to mark invoice as paid: ${errorMessage}`);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const getDaysUntilDue = (timestamp: number) => {
    const days = Math.ceil(
      (timestamp * 1000 - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return days;
  };

  const getStatusBadge = (invoice: UserInvoice) => {
    if (invoice.isPaid) {
      return <Badge className="bg-green-100 text-green-700">Paid</Badge>;
    }
    if (invoice.isListed) {
      return <Badge variant="secondary">Listed for Sale</Badge>;
    }

    const daysUntilDue = getDaysUntilDue(invoice.dueDate);
    if (daysUntilDue < 0) {
      return <Badge variant="destructive">Overdue</Badge>;
    }
    if (daysUntilDue <= 7) {
      return <Badge className="bg-yellow-100 text-yellow-700">Due Soon</Badge>;
    }

    return <Badge variant="outline">Active</Badge>;
  };

  // Statistics
  const totalAmount = userInvoices.reduce(
    (sum, inv) => sum + Number(inv.amount || 0),
    0
  );
  const paidAmount = userInvoices
    .filter((inv) => inv.isPaid)
    .reduce((sum, inv) => sum + Number(inv.amount || 0), 0);
  const listedCount = userInvoices.filter(
    (inv) => inv.isListed && !inv.isPaid
  ).length;
  const overdueCount = userInvoices.filter(
    (inv) => !inv.isPaid && getDaysUntilDue(inv.dueDate) < 0
  ).length;

  if (!isConnected) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <Wallet className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="text-lg font-medium">Connect Your Wallet</h3>
            <p className="text-muted-foreground">
              Please connect your wallet to view your invoices
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
            <FileText className="h-5 w-5" />
            <span>My Invoices</span>
          </CardTitle>
          <p className="text-muted-foreground">
            Manage your tokenized invoices and track payments
          </p>
        </CardHeader>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-lg font-semibold">
                  {totalAmount.toFixed(3)} ETH
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Paid</p>
                <p className="text-lg font-semibold">
                  {paidAmount.toFixed(3)} ETH
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Tag className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Listed</p>
                <p className="text-lg font-semibold">{listedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-lg font-semibold">{overdueCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices List */}
      {loading ? (
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading your invoices...</span>
          </CardContent>
        </Card>
      ) : userInvoices.length === 0 ? (
        <Card>
          <CardContent className="text-center p-8">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Invoices Yet</h3>
            <p className="text-muted-foreground mb-4">
              You haven't created any invoices yet. Start by creating your first
              tokenized invoice.
            </p>
            <Button>Create Invoice</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {userInvoices.map((invoice) => (
            <Card key={invoice.tokenId}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  {/* Invoice Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold">
                        {invoice.invoiceNumber}
                      </h3>
                      {getStatusBadge(invoice)}
                      <Badge variant="outline" className="font-mono">
                        #{invoice.tokenId}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Amount: </span>
                        <span className="font-medium">
                          {invoice.amount} ETH
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Due: </span>
                        <span className="font-medium">
                          {formatDate(invoice.dueDate)}
                        </span>
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({getDaysUntilDue(invoice.dueDate)} days)
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Payer: </span>
                        <span className="font-medium">{invoice.payerName}</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {invoice.description}
                    </p>

                    {invoice.isListed && invoice.listingPrice && (
                      <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded text-sm">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        <span>
                          Listed for sale at{" "}
                          <strong>{invoice.listingPrice} ETH</strong>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 lg:ml-6">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>

                      {!invoice.isPaid && !invoice.isListed && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowListingModal(invoice.tokenId)}
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          List for Sale
                        </Button>
                      )}

                      {!invoice.isPaid && (
                        <Button
                          size="sm"
                          onClick={() => handleMarkAsPaid(invoice.tokenId)}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Mark Paid
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Listing Modal */}
                {showListingModal === invoice.tokenId && (
                  <div className="mt-4 p-4 border rounded-lg bg-muted/30">
                    <h4 className="font-medium mb-3">List Invoice for Sale</h4>
                    <div className="flex items-end space-x-2">
                      <div className="flex-1">
                        <Label htmlFor="listingPrice">Sale Price (ETH)</Label>
                        <Input
                          id="listingPrice"
                          type="number"
                          step="0.001"
                          placeholder="0.000"
                          value={listingPrice}
                          onChange={(e) => setListingPrice(e.target.value)}
                        />
                      </div>
                      <Button
                        onClick={() => handleListInvoice(invoice.tokenId)}
                        disabled={listingInvoice === invoice.tokenId}
                      >
                        {listingInvoice === invoice.tokenId ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        ) : (
                          <Tag className="h-4 w-4 mr-1" />
                        )}
                        List
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowListingModal("");
                          setListingPrice("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Original amount: {invoice.amount} ETH
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
