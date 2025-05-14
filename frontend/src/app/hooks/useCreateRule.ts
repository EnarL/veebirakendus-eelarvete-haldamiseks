import { useState } from "react";

const useCreateRule = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createRule = async (rule: { criterion: string, categoryName: string;  }) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/grouping-rules`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(rule),
            });

            if (!response.ok) {
                throw new Error("Failed to create rule");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return { createRule, loading, error };
};

export default useCreateRule;