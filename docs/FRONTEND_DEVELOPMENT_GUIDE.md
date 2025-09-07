# Frontend Development Guide

## Overview

The Fylaro Finance frontend is built with React 18, TypeScript, and modern web technologies. This guide covers the architecture, components, and development practices for the user interface.

## Technology Stack

### Core Technologies

- **React 18**: Modern React with concurrent features
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework

### UI Components

- **shadcn/ui**: High-quality component library
- **Radix UI**: Accessible component primitives
- **Lucide React**: Modern icon library
- **Recharts**: Chart and analytics components

### Web3 Integration

- **wagmi**: React hooks for Ethereum
- **RainbowKit**: Wallet connection interface
- **Ethers.js**: Ethereum library
- **Viem**: Type-safe Ethereum library

### State Management

- **Zustand**: Lightweight state management
- **React Query**: Server state management
- **React Hook Form**: Form handling

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (shadcn/ui)
│   ├── layout/         # Layout components
│   ├── features/       # Feature-specific components
│   └── animations/     # Animation components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries and configurations
├── services/           # API and external service integrations
├── contexts/           # React contexts
├── utils/              # Utility functions
├── assets/             # Static assets
└── generated/          # Generated files (contract ABIs, types)
```

## Core Components

### Layout Components

#### Navbar

Main navigation component with wallet integration.

```typescript
// components/layout/Navbar.tsx
interface NavbarProps {
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const { isConnected, address } = useAccount();
  const { openConnectModal } = useConnectModal();

  return (
    <nav className={cn("flex items-center justify-between p-4", className)}>
      <Logo />
      <NavigationMenu />
      <WalletButton />
    </nav>
  );
};
```

#### Sidebar

Collapsible sidebar for navigation.

```typescript
// components/layout/Sidebar.tsx
interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full w-64 bg-background border-r transition-transform",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <SidebarContent />
    </aside>
  );
};
```

### Feature Components

#### InvoiceUpload

Component for uploading and tokenizing invoices.

```typescript
// components/features/InvoiceUpload.tsx
interface InvoiceUploadProps {
  onSuccess?: (invoice: Invoice) => void;
}

export const InvoiceUpload: React.FC<InvoiceUploadProps> = ({ onSuccess }) => {
  const { upload } = useInvoiceUpload();
  const [file, setFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
  });

  const onSubmit = async (data: InvoiceFormData) => {
    if (!file) return;

    try {
      const result = await upload(file, data);
      onSuccess?.(result);
    } catch (error) {
      toast.error("Failed to upload invoice");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Invoice</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FileDropzone
            onFileSelect={setFile}
            acceptedFileTypes={[".pdf", ".png", ".jpg"]}
          />
          <InvoiceFormFields register={register} errors={errors} />
          <Button type="submit" disabled={!file}>
            Upload and Tokenize
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
```

#### MarketplaceGrid

Grid display for browsing available invoices.

```typescript
// components/features/MarketplaceGrid.tsx
interface MarketplaceGridProps {
  filters?: MarketplaceFilters;
  onInvoiceSelect?: (invoice: MarketplaceInvoice) => void;
}

export const MarketplaceGrid: React.FC<MarketplaceGridProps> = ({
  filters,
  onInvoiceSelect,
}) => {
  const { data: invoices, isLoading } = useMarketplaceInvoices(filters);

  if (isLoading) return <InvoiceGridSkeleton />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {invoices?.map((invoice) => (
        <InvoiceCard
          key={invoice.id}
          invoice={invoice}
          onClick={() => onInvoiceSelect?.(invoice)}
        />
      ))}
    </div>
  );
};
```

#### PortfolioOverview

Dashboard component showing investment portfolio.

```typescript
// components/features/PortfolioOverview.tsx
export const PortfolioOverview: React.FC = () => {
  const { data: portfolio } = usePortfolio();
  const { data: analytics } = usePortfolioAnalytics();

  return (
    <div className="space-y-6">
      <PortfolioSummaryCards data={portfolio?.summary} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PortfolioChart data={analytics?.performanceHistory} />
        <AssetAllocationChart data={analytics?.allocation} />
      </div>
      <PortfolioTable investments={portfolio?.investments} />
    </div>
  );
};
```

## Custom Hooks

### useInvoiceUpload

Hook for uploading and tokenizing invoices.

```typescript
// hooks/useInvoiceUpload.ts
interface UseInvoiceUploadReturn {
  upload: (file: File, data: InvoiceFormData) => Promise<Invoice>;
  isUploading: boolean;
  error: string | null;
}

export const useInvoiceUpload = (): UseInvoiceUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { contract } = useInvoiceTokenContract();

  const upload = async (
    file: File,
    data: InvoiceFormData
  ): Promise<Invoice> => {
    setIsUploading(true);
    setError(null);

    try {
      // Upload to IPFS
      const ipfsHash = await uploadToIPFS(file);

      // Mint token on blockchain
      const tx = await contract.mintInvoice(
        data.invoiceNumber,
        parseEther(data.amount),
        Math.floor(new Date(data.dueDate).getTime() / 1000),
        ipfsHash,
        data.issuerAddress
      );

      await tx.wait();

      // Save to database
      const invoice = await saveInvoiceToDatabase({
        ...data,
        ipfsHash,
        transactionHash: tx.hash,
      });

      return invoice;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setError(message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return { upload, isUploading, error };
};
```

### useMarketplaceInvoices

Hook for fetching marketplace invoices with filtering.

```typescript
// hooks/useMarketplaceInvoices.ts
export const useMarketplaceInvoices = (filters?: MarketplaceFilters) => {
  return useQuery({
    queryKey: ["marketplace-invoices", filters],
    queryFn: () => fetchMarketplaceInvoices(filters),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // 1 minute
  });
};
```

### usePortfolio

Hook for managing user portfolio data.

```typescript
// hooks/usePortfolio.ts
export const usePortfolio = () => {
  const { address } = useAccount();

  return useQuery({
    queryKey: ["portfolio", address],
    queryFn: () => fetchPortfolio(address),
    enabled: !!address,
    refetchInterval: 30 * 1000,
  });
};
```

## State Management

### Zustand Stores

#### User Store

Global user state management.

```typescript
// lib/stores/userStore.ts
interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
```

#### UI Store

UI state management.

```typescript
// lib/stores/uiStore.ts
interface UIState {
  sidebarOpen: boolean;
  theme: "light" | "dark";
  notifications: Notification[];
  toggleSidebar: () => void;
  setTheme: (theme: "light" | "dark") => void;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  theme: "dark",
  notifications: [],
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setTheme: (theme) => set({ theme }),
  addNotification: (notification) =>
    set((state) => ({ notifications: [...state.notifications, notification] })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));
```

## Web3 Integration

### Wagmi Configuration

```typescript
// lib/web3-config.ts
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { arbitrumSepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Fylaro Finance",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
  chains: [arbitrumSepolia],
  ssr: false,
});
```

### Contract Hooks

```typescript
// hooks/useInvoiceTokenContract.ts
export const useInvoiceTokenContract = () => {
  const { data: contract } = useContract({
    address: process.env.NEXT_PUBLIC_INVOICE_TOKEN_ADDRESS as `0x${string}`,
    abi: InvoiceTokenABI,
  });

  return { contract };
};
```

### Contract Interactions

```typescript
// services/contractService.ts
export class ContractService {
  static async mintInvoice(
    contract: Contract,
    invoiceData: InvoiceData
  ): Promise<TransactionResponse> {
    const tx = await contract.mintInvoice(
      invoiceData.invoiceNumber,
      parseEther(invoiceData.amount),
      Math.floor(new Date(invoiceData.dueDate).getTime() / 1000),
      invoiceData.ipfsHash,
      invoiceData.issuerAddress
    );

    return tx;
  }

  static async investInInvoice(
    contract: Contract,
    tokenId: number,
    amount: string
  ): Promise<TransactionResponse> {
    const tx = await contract.investInInvoice(tokenId, parseEther(amount), {
      value: parseEther(amount),
    });

    return tx;
  }
}
```

## Styling and Theming

### Tailwind Configuration

```typescript
// tailwind.config.ts
export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

### CSS Variables

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 84% 4.9%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
  }
}
```

## Testing

### Component Testing

```typescript
// components/__tests__/InvoiceCard.test.tsx
import { render, screen } from "@testing-library/react";
import { InvoiceCard } from "../InvoiceCard";

const mockInvoice = {
  id: "1",
  invoiceNumber: "INV-001",
  amount: "10000",
  status: "verified",
  riskRating: "A-",
};

describe("InvoiceCard", () => {
  it("renders invoice information correctly", () => {
    render(<InvoiceCard invoice={mockInvoice} />);

    expect(screen.getByText("INV-001")).toBeInTheDocument();
    expect(screen.getByText("$10,000")).toBeInTheDocument();
    expect(screen.getByText("A-")).toBeInTheDocument();
  });

  it("calls onClick when card is clicked", () => {
    const handleClick = jest.fn();
    render(<InvoiceCard invoice={mockInvoice} onClick={handleClick} />);

    screen.getByRole("button").click();
    expect(handleClick).toHaveBeenCalledWith(mockInvoice);
  });
});
```

### Hook Testing

```typescript
// hooks/__tests__/useInvoiceUpload.test.ts
import { renderHook, act } from "@testing-library/react";
import { useInvoiceUpload } from "../useInvoiceUpload";

describe("useInvoiceUpload", () => {
  it("uploads invoice successfully", async () => {
    const { result } = renderHook(() => useInvoiceUpload());

    const file = new File(["test"], "test.pdf", { type: "application/pdf" });
    const data = {
      invoiceNumber: "INV-001",
      amount: "10000",
      dueDate: "2025-12-31",
      issuerAddress: "0x123...",
    };

    await act(async () => {
      await result.current.upload(file, data);
    });

    expect(result.current.isUploading).toBe(false);
    expect(result.current.error).toBe(null);
  });
});
```

## Performance Optimization

### Code Splitting

```typescript
// Lazy load pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const Portfolio = lazy(() => import("./pages/Portfolio"));

// Use Suspense for loading states
<Suspense fallback={<PageSkeleton />}>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/marketplace" element={<Marketplace />} />
    <Route path="/portfolio" element={<Portfolio />} />
  </Routes>
</Suspense>;
```

### Memoization

```typescript
// Memoize expensive calculations
const portfolioMetrics = useMemo(() => {
  return calculatePortfolioMetrics(investments);
}, [investments]);

// Memoize components
const MemoizedInvoiceCard = memo(InvoiceCard);
```

### Virtual Scrolling

```typescript
// For large lists
import { FixedSizeList as List } from "react-window";

const VirtualizedInvoiceList = ({ invoices }) => (
  <List
    height={600}
    itemCount={invoices.length}
    itemSize={120}
    itemData={invoices}
  >
    {({ index, style, data }) => (
      <div style={style}>
        <InvoiceCard invoice={data[index]} />
      </div>
    )}
  </List>
);
```

## Deployment

### Build Configuration

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          web3: ["wagmi", "@rainbow-me/rainbowkit", "ethers"],
          ui: ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu"],
        },
      },
    },
  },
  define: {
    global: "globalThis",
  },
});
```

### Environment Variables

```bash
# .env.production
VITE_API_BASE_URL=https://api.fylaro.finance
VITE_WEBSOCKET_URL=wss://api.fylaro.finance
VITE_CHAIN_ID=421614
VITE_INVOICE_TOKEN_ADDRESS=0x1FA52B372eC9675337D0c8ddF97CCEcC2c8Ba2B3
```

### Vercel Deployment

```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```
