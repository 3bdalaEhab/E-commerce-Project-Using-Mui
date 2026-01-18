import { ReactNode } from "react";

export interface NavItem {
    name: string;
    path?: string;
    icon: ReactNode;
    numItem?: number;
    numWishItem?: number;
}
