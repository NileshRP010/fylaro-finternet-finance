import DashboardLayout from "@/components/layout/DashboardLayout";
import { InvoiceMarketplace } from "@/components/features/InvoiceMarketplace";

const Marketplace = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <InvoiceMarketplace />
      </div>
    </DashboardLayout>
  );
};

export default Marketplace;
