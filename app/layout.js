import { Open_Sans } from "next/font/google";
import { Toaster } from 'sonner';
import "@/app/styles/global.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
});



const SITE_URL = "https://filmcounts.vercel.app/";
const BANNER_URL = "https://raw.githubusercontent.com/DarknessMonarch/Filmcounts/refs/heads/master/public/assets/banner.png";

export const viewport = {
  themeColor: "#2D3748",
};

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Filmcounts - Budget tracking made easier",
    template: "%s , Filmcounts"
  },
  applicationName: "Filmcounts",
  description: "Manage your budgets well",
  authors: [{ name: "Filmcounts", url: SITE_URL }],
  generator: "Next.js",
  keywords: [
    "Filmcounts",
    "finance",
    "money",
    "assets",
    "loan",
    "requisition",
    "bank",
    "budget",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Filmcounts - Budget made easier",
    description: "Manage your budgets well",
    url: SITE_URL,
    siteName: "Filmcounts",
    images: [{
      url: BANNER_URL,
      width: 1200,
      height: 630,
      alt: "Filmcounts Banner"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Filmcounts - Budget made easier",
    description: "Manage your budgets well",
    images: [BANNER_URL],
    creator: "@Filmcounts"
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    }
  },
  verification: {
    google: "",
    yandex: "",
  },
  alternates: {
    canonical: `${SITE_URL}/`,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
    shortcut: "/favicon.ico"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={openSans.className}>

      <body>
        <Toaster
          position="top-center"
          richColors={true}
          toastOptions={{
            style: {
              background: "#8aeccc",
              color: "#ff3b3b",
              borderRadius: "15px",
              border: "1px solid #ff3b3b",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
