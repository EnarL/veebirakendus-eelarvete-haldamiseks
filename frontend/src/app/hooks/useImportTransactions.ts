import { useState } from "react";

export const useImportTransactions = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const importTransactions = async (file: File): Promise<void> => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transaction/import`, {
                method: "POST",
                body: formData,
                credentials: "include",

            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || "Failed to import transactions");
            }

            const successData = await response.text();
            setSuccessMessage(successData);
        } catch (err: any) {
            setError(err.message || "An unknown error occurred");
        } finally {
            setLoading(false);
        }
    };

    return { importTransactions, loading, error, successMessage };
};