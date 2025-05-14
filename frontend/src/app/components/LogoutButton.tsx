import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useLogout } from '@/app/hooks/useLogout';
import { ExitToApp } from '@mui/icons-material';

export function LogoutButton() {
    const { logout, isLoading } = useLogout();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <Button
            onClick={handleLogout}
            disabled={isLoading}
            startIcon={<ExitToApp />}
            sx={{
                color: 'white',
                fontWeight: 'medium',
                borderRadius: '8px',
                transition: 'background-color 0.3s',
                '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
            }}
        >
            {isLoading ? 'Väljalogimine...' : 'Logi välja'}
        </Button>
    );
}