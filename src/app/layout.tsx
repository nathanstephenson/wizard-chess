import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { ApiProvider } from "@/hooks/useApi"
import { getApi } from "../../server"
import "./globals.css"
import ReactQueryProvider from "./query-provider"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"]
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"]
})

export const metadata: Metadata = {
    title: "Chess",
    description: "Chess"
}

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <ReactQueryProvider>
                    <ApiProvider api={getApi()}>{children}</ApiProvider>
                </ReactQueryProvider>
            </body>
        </html>
    )
}
