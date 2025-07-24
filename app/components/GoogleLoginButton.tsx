import React from "react";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { LayoutDashboard, LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "~/components/context/auth-context";
import { toast } from "sonner";
import { useNavigate } from "react-router";

interface GoogleLoginButtonProps {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  variant = "default",
  size = "default",
  className = "",
}) => {
  const { user, loading, signInWithGoogle, logout } = useAuth();
  const navigate = useNavigate();
  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast.success("Successfully signed in with Google!");
    } catch (error) {
      toast.error("Failed to sign in with Google. Please try again.");
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      toast.success("Successfully signed out!");
    } catch (error) {
      toast.error("Failed to sign out. Please try again.");
    }
  };

  if (loading) {
    return (
      <Button
        variant={variant}
        size={size}
        className={className}
        disabled
        aria-label="Loading authentication state"
      >
        Loading...
      </Button>
    );
  }

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={`relative h-10 w-10 rounded-full ${className}`}
            aria-label={`User menu for ${user.displayName || user.email}`}
          >
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={user.photoURL || ""}
                alt={user.displayName || "User avatar"}
              />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user.displayName || "User"}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/menu")} className="cursor-pointer">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Menu</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleSignIn}
      aria-label="Sign in with Google"
    >
      <LogIn className="mr-2 h-4 w-4" />
      Sign in with Google
    </Button>
  );
};
