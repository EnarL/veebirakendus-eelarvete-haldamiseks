import {Metadata} from 'next'
import ClientOnlyLayout from "@/app/ClientOnlyLayout";


export const metadata: Metadata = {
    title: 'Budgeting application',
    description: 'Web application for managing personal and shared budgets',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body>
        <ClientOnlyLayout>
            {children}
        </ClientOnlyLayout>
        </body>
        </html>
    );
}