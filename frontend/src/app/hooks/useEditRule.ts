import { useState } from "react";

const useEditRule = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const editRule = async (id: number, updatedRule: { name: string; conditions: string[] }) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/grouping-rules/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(updatedRule),
            });

            if (!response.ok) {
                throw new Error("Failed to update rule");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return { editRule, loading, error };
};

export default useEditRule;