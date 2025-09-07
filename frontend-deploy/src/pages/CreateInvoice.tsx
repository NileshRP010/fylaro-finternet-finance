import DashboardLayout from "@/components/layout/DashboardLayout";
import { InvoiceCreation } from "@/components/features/InvoiceCreation";
import { useNavigate } from "react-router-dom";

const UploadInvoice = () => {
  const navigate = useNavigate();

  const handleInvoiceCreated = (tokenId: string) => {
    // Navigate to portfolio or invoice details after creation
    navigate(`/portfolio?highlight=${tokenId}`);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <InvoiceCreation onInvoiceCreated={handleInvoiceCreated} />
      </div>
    </DashboardLayout>
  );
};

export default UploadInvoice;
