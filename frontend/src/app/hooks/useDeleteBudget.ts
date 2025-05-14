import { useState } from "react";

export const useDeleteBudget = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const deleteBudget = async (id: number) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/budget/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to delete budget");
            }

            setSuccess(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { deleteBudget, loading, error, success };
};