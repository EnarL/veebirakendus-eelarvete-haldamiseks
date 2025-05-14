// Updated useDeleteCategory.ts
import { useState } from "react";

const useDeleteCategory = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [deletedId, setDeletedId] = useState<number | null>(null);

    const deleteCategory = async (id: number) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        setDeletedId(null);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to delete category");
            }

            setSuccess(true);
            setDeletedId(id); // Store the deleted ID
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return { deleteCategory, loading, error, success, deletedId };
};

export default useDeleteCategory;