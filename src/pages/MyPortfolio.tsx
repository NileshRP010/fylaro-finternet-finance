import DashboardLayout from "@/components/layout/DashboardLayout";
import { MyInvoices } from "@/components/features/MyInvoices";

const Portfolio = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <MyInvoices />
      </div>
    </DashboardLayout>
  );
};

export default Portfolio;
