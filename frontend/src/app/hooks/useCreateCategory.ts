import { useState } from "react";

const useCreateCategory = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const createCategory = async (category: { name: string; userId: number; isGlobal: boolean }) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(category),
            });

            if (!response.ok) {
                throw new Error("Failed to create category");
            }

            setSuccess(true);
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return { createCategory, loading, error, success };
};

export default useCreateCategory;