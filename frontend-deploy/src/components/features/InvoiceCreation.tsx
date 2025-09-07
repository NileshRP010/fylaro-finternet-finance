import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAccount, useWalletClient } from "wagmi";
import { toast } from "sonner";
import { contractService, InvoiceData } from "@/services/contractServiceV2";
import {
  FileText,
  Send,
  Calendar,
  DollarSign,
  User,
  Hash,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Wallet,
  ArrowRight,
  Upload,
  X,
} from "lucide-react";

interface InvoiceCreationProps {
  onInvoiceCreated?: (tokenId: string) => void;
}

export const InvoiceCreation = ({ onInvoiceCreated }: InvoiceCreationProps) => {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const [formData, setFormData] = useState({
    amount: "",
    dueDate: "",
    description: "",
    issuerName: "",
    payerName: "",
    invoiceNumber: "",
    invoiceFile: null as File | null,
  });

  const [isCreating, setIsCreating] = useState(false);
  const [createdTokenId, setCreatedTokenId] = useState<string>("");
  const [estimatedGas, setEstimatedGas] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  // Check verification status when address changes
  useEffect(() => {
    const checkVerificationStatus = async () => {
      if (!address) return;
      try {
        const verified = await contractService.isVerifiedIssuer(address);
        setIsVerified(verified);
      } catch (error) {
        console.error("Error checking verification status:", error);
        setIsVerified(false);
      }
    };

    if (address) {
      checkVerificationStatus();
    } else {
      setIsVerified(null);
    }
  }, [address]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }

      // Check file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/pdf",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload an image (JPEG, PNG, GIF) or PDF file");
        return;
      }

      setFormData((prev) => ({ ...prev, invoiceFile: file }));
      toast.success("Invoice file uploaded successfully");
    }
  };

  const removeFile = () => {
    setFormData((prev) => ({ ...prev, invoiceFile: null }));
  };

  const validateForm = (): string | null => {
    if (
      !formData.amount ||
      isNaN(Number(formData.amount)) ||
      Number(formData.amount) <= 0
    ) {
      return "Please enter a valid amount";
    }

    // Add reasonable upper limit for ETH amounts (prevent astronomical gas fees)
    if (Number(formData.amount) > 1000) {
      return "Amount cannot exceed 1000 ETH";
    }

    // Ensure minimum amount for practical purposes
    if (Number(formData.amount) < 0.001) {
      return "Amount must be at least 0.001 ETH";
    }

    if (!formData.dueDate) {
      return "Please select a due date";
    }
    if (new Date(formData.dueDate) <= new Date()) {
      return "Due date must be in the future";
    }
    if (!formData.description.trim()) {
      return "Please enter an invoice description";
    }
    if (!formData.issuerName.trim()) {
      return "Please enter the issuer name";
    }
    if (!formData.payerName.trim()) {
      return "Please enter the payer name";
    }
    if (!formData.invoiceNumber.trim()) {
      return "Please enter an invoice number";
    }
    return null;
  };

  const estimateGasCost = async () => {
    try {
      if (!walletClient) return;

      // Arbitrum Sepolia gas estimation
      // Typical values: Gas limit ~150,000, Gas price ~0.1 Gwei
      const gasLimit = 150000; // Reasonable gas limit for tokenizeInvoice
      const gasPriceGwei = 0.1; // Arbitrum L2 gas price in Gwei
      const verificationFee = 0.01; // 0.01 ETH verification fee required by contract

      // Calculate gas cost in ETH
      const gasCostEth = (gasLimit * gasPriceGwei) / 1000000000; // Convert Gwei to ETH
      const totalCostEth = gasCostEth + verificationFee; // Add verification fee

      // Target $1-2 range for total cost
      const finalCost = Math.min(totalCostEth, 0.002); // Cap at $2 equivalent (~0.002 ETH)

      setEstimatedGas(finalCost.toFixed(6));
    } catch (error) {
      console.error("Error estimating gas:", error);
      // Fallback to fixed reasonable amount
      setEstimatedGas("0.011"); // 0.01 verification fee + ~0.001 gas
    }
  };

  const handleAddVerifiedIssuer = async () => {
    if (!address) {
      toast.error("No wallet connected");
      return;
    }

    setIsVerifying(true);
    try {
      await contractService.addVerifiedIssuer(address);
      setIsVerified(true);
      toast.success("Successfully added as verified issuer!");
    } catch (error) {
      console.error("Error adding verified issuer:", error);

      // Check if user cancelled the transaction
      if (error instanceof Error && error.message === "Transaction cancelled") {
        // Don't show error for user cancellation, the contract service already showed a friendly message
        return;
      }

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      // Don't show duplicate cancellation messages
      if (!errorMessage.includes("Transaction cancelled")) {
        toast.error(`Failed to add verified issuer: ${errorMessage}`);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCreateInvoice = async () => {
    if (!isConnected || !walletClient) {
      toast.error("Please connect your wallet first");
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsCreating(true);

    try {
      // Prepare invoice data
      const invoiceData: InvoiceData = {
        amount: formData.amount,
        dueDate: Math.floor(new Date(formData.dueDate).getTime() / 1000),
        description: formData.description,
        issuerName: formData.issuerName,
        payerName: formData.payerName,
        invoiceNumber: formData.invoiceNumber,
      };

      console.log("Creating invoice on blockchain...", invoiceData);

      // Create invoice on blockchain - pass the connected wallet address
      const tokenId = await contractService.createInvoice(invoiceData, address);

      console.log("Invoice created with token ID:", tokenId);
      setCreatedTokenId(tokenId);

      // Call callback if provided
      if (onInvoiceCreated) {
        onInvoiceCreated(tokenId);
      }

      // Reset form
      setFormData({
        amount: "",
        dueDate: "",
        description: "",
        issuerName: "",
        payerName: "",
        invoiceNumber: "",
        invoiceFile: null,
      });
    } catch (error: unknown) {
      console.error("Error creating invoice:", error);

      // Check if user cancelled the transaction
      if (error instanceof Error && error.message === "Transaction cancelled") {
        // Don't show error for user cancellation, the contract service already showed a friendly message
        return;
      }

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      // Don't show duplicate cancellation messages
      if (!errorMessage.includes("Transaction cancelled")) {
        toast.error(`Failed to create invoice: ${errorMessage}`);
      }
    } finally {
      setIsCreating(false);
    }
  };

  // Calculate due date in days
  const getDaysUntilDue = () => {
    if (!formData.dueDate) return "";
    const days = Math.ceil(
      (new Date(formData.dueDate).getTime() - Date.now()) /
        (1000 * 60 * 60 * 24)
    );
    return `${days} days from now`;
  };

  if (!isConnected) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <Wallet className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="text-lg font-medium">Connect Your Wallet</h3>
            <p className="text-muted-foreground">
              Please connect your wallet to create and tokenize invoices on the
              blockchain
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (createdTokenId) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-green-600">
                Invoice Created Successfully!
              </h3>
              <p className="text-muted-foreground">
                Your invoice has been tokenized and deployed on Arbitrum Sepolia
              </p>
            </div>

            <div className="bg-muted/30 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Token ID:</span>
                <Badge variant="secondary" className="font-mono">
                  #{createdTokenId}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Network:</span>
                <Badge variant="outline">Arbitrum Sepolia</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status:</span>
                <Badge className="bg-green-100 text-green-700">
                  Live on Blockchain
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => {
                  setCreatedTokenId("");
                  setFormData({
                    amount: "",
                    dueDate: "",
                    description: "",
                    issuerName: "",
                    payerName: "",
                    invoiceNumber: "",
                    invoiceFile: null,
                  });
                }}
                variant="outline"
                className="w-full"
              >
                Create Another Invoice
              </Button>

              <Button
                onClick={() => {
                  // Navigate to invoice details or marketplace
                  window.open(
                    `https://sepolia.arbiscan.io/token/${
                      contractService.getContractAddresses().invoiceToken
                    }?a=${createdTokenId}`,
                    "_blank"
                  );
                }}
                className="w-full"
              >
                View on Arbiscan
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Create & Tokenize Invoice</span>
        </CardTitle>
        <p className="text-muted-foreground">
          Transform your invoice into a tradeable blockchain token on Arbitrum
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Connected Wallet Info */}
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center space-x-2">
            <Wallet className="h-4 w-4" />
            <span className="text-sm font-medium">Connected:</span>
          </div>
          <Badge variant="secondary" className="font-mono">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </Badge>
        </div>

        {/* Verification Status */}
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center space-x-2">
            {isVerified === true ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : isVerified === false ? (
              <AlertCircle className="h-4 w-4 text-amber-500" />
            ) : (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            <span className="text-sm font-medium">Issuer Status:</span>
          </div>
          <div className="flex items-center space-x-2">
            {isVerified === true ? (
              <Badge variant="default" className="bg-green-500">
                Verified
              </Badge>
            ) : isVerified === false ? (
              <>
                <Badge variant="secondary">Not Verified</Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAddVerifiedIssuer}
                  disabled={isVerifying}
                >
                  {isVerifying ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    "Verify Address"
                  )}
                </Button>
              </>
            ) : (
              <Badge variant="outline">Checking...</Badge>
            )}
          </div>
        </div>

        {/* Invoice Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="flex items-center space-x-1">
                <DollarSign className="h-4 w-4" />
                <span>Invoice Amount (ETH)</span>
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.001"
                min="0.001"
                max="1000"
                placeholder="0.100"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                onFocus={estimateGasCost}
              />
              <p className="text-xs text-muted-foreground">
                Enter amount in ETH (min: 0.001, max: 1000)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate" className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Due Date</span>
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange("dueDate", e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
              {formData.dueDate && (
                <p className="text-xs text-muted-foreground">
                  {getDaysUntilDue()}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="invoiceNumber"
              className="flex items-center space-x-1"
            >
              <Hash className="h-4 w-4" />
              <span>Invoice Number</span>
            </Label>
            <Input
              id="invoiceNumber"
              placeholder="INV-2025-001"
              value={formData.invoiceNumber}
              onChange={(e) =>
                handleInputChange("invoiceNumber", e.target.value)
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="issuerName"
                className="flex items-center space-x-1"
              >
                <User className="h-4 w-4" />
                <span>Issuer Name</span>
              </Label>
              <Input
                id="issuerName"
                placeholder="Your Company Name"
                value={formData.issuerName}
                onChange={(e) =>
                  handleInputChange("issuerName", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="payerName"
                className="flex items-center space-x-1"
              >
                <User className="h-4 w-4" />
                <span>Payer Name</span>
              </Label>
              <Input
                id="payerName"
                placeholder="Client Company Name"
                value={formData.payerName}
                onChange={(e) => handleInputChange("payerName", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the goods or services provided..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
            />
          </div>

          {/* File Upload Section */}
          <div className="space-y-2">
            <Label className="flex items-center space-x-1">
              <Upload className="h-4 w-4" />
              <span>Invoice Document (Optional)</span>
            </Label>

            {!formData.invoiceFile ? (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                <div className="space-y-2">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">
                      Upload invoice document
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, GIF, PDF up to 10MB
                    </p>
                  </div>
                  <Input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      document.getElementById("file-upload")?.click()
                    }
                  >
                    Choose File
                  </Button>
                </div>
              </div>
            ) : (
              <div className="border border-muted rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {formData.invoiceFile.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(formData.invoiceFile.size / 1024 / 1024).toFixed(2)}{" "}
                        MB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Transaction Info */}
        <div className="space-y-3">
          <h4 className="font-medium">Transaction Details</h4>

          <div className="bg-muted/30 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Network:</span>
              <Badge variant="outline">Arbitrum Sepolia</Badge>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span>Contract:</span>
              <span className="font-mono text-xs">
                {contractService
                  .getContractAddresses()
                  .invoiceToken?.slice(0, 8)}
                ...
              </span>
            </div>

            {estimatedGas && (
              <div className="flex items-center justify-between text-sm">
                <span>Estimated Gas:</span>
                <span className="text-green-600">
                  ~{Number(estimatedGas).toFixed(0.01)} ETH
                </span>
              </div>
            )}
          </div>

          <div className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-medium">What happens next:</p>
              <ul className="mt-1 space-y-1 text-xs">
                <li>• Your invoice will be minted as an ERC-1155 token</li>
                <li>• It will be stored permanently on Arbitrum blockchain</li>
                <li>• You can trade, sell, or use it as collateral</li>
                <li>• Payments can be tracked and settled automatically</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Create Button */}
        <Button
          onClick={handleCreateInvoice}
          disabled={isCreating}
          className="w-full"
          size="lg"
        >
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Invoice on Blockchain...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Create & Tokenize Invoice
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
