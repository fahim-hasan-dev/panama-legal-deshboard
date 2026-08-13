import {
  LayoutDashboard,
  Users,
  Scale,
  Briefcase,
  HelpCircle,
  BookOpen,
  FileText,
  Bot,
  CreditCard,
  Star,
  Globe,
  Bell,
  Lock,
} from "lucide-react";

export const sidebarMenu = {
  navMain: [
    {
      title: "Overview",
      url: "/",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Users",
      url: "/users",
      icon: Users,
    },
    {
      title: "Lawyers",
      url: "/lawyers",
      icon: Scale,
    },
    {
      title: "Cases",
      url: "/cases",
      icon: Briefcase,
    },
    {
      title: "Case Questions",
      url: "/case-questions",
      icon: HelpCircle,
    },
    {
      title: "Legal Library",
      url: "/library",
      icon: BookOpen,
    },
    {
      title: "Articles",
      url: "/articles",
      icon: FileText,
    },
    {
      title: "AI Chatbot",
      url: "/chatbot",
      icon: Bot,
    },
    {
      title: "Subscriptions",
      url: "/subscriptions",
      icon: CreditCard,
    },
    {
      title: "Lawyer Reviews",
      url: "/reviews",
      icon: Star,
    },
    {
      title: "Public Content",
      url: "/public-content",
      icon: Globe,
    },
    {
      title: "Notifications",
      url: "/notifications",
      icon: Bell,
    },
    {
      title: "Settings & Password",
      url: "/settings",
      icon: Lock,
    },
  ],
};

export const profileData = {
  name: "PV & ASOCIADOS Legal Group Admin",
  email: "admin@pvasociados.pa",
  role: "Admin",
};
