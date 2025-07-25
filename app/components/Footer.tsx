import React from "react";
import { Separator } from "~/components/ui/separator";

export const Footer = () => {
  return (
    <footer className="border-t bg-muted/30 z-100">
      <div className="w-full px-16 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img
                src="/LogoDengarinklusif.png"
                alt="Dengar Inklusif Logo"
                className="h-8 w-8"
              />
              <span className="font-bold text-lg">Dengar Inklusif</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Empowering visually impaired students with accessible, voice-first
              learning technology.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Features</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Audio Lessons
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Document Conversion
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Voice Exercises
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Screen Reader Support
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Accessibility Guide
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Teacher Resources
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Email: support@dengarinklusif.id</li>
              <li>Phone: +62 21 1234 5678</li>
              <li>Address: Jakarta, Indonesia</li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 Dengar Inklusif. Built with ❤️ for inclusive education.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
