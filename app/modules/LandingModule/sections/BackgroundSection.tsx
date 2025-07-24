import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export const BackgroundSection = () => {
  return (
    <section
      id="background"
      className="w-full py-12 md:py-24 lg:py-32"
    >
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            The Accessibility Challenge
          </h2>
          <p className="mt-4 text-muted-foreground md:text-lg max-w-[600px] mx-auto">
            Understanding the educational barriers faced by visually impaired
            students in Indonesia
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {/* Statistics Cards */}
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-primary">
                285M
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Visually impaired people globally according to WHO
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-primary">
                10,000+
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Blind students in Indonesian SLBs (Kemdikbud 2022)
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-primary">
                95%
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Learning platforms lack proper accessibility features
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl" role="img" aria-label="Problem icon">
                ⚠️
              </span>
              The Problem
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-base leading-relaxed">
              In Indonesia, blind and visually impaired students face
              significant barriers to education. Despite the growing number of
              digital learning platforms, few are truly accessible for blind
              children. Most educational technology relies heavily on visual
              interfaces, leaving audio and tactile needs unaddressed.
            </p>
            <p className="text-base leading-relaxed">
              This digital divide results in limited access to educational
              materials, reduced interactive learning opportunities, and
              decreased academic participation for students in grades SD through
              SMA. Traditional assistive technologies often require expensive
              hardware or lack integration with modern curriculum standards.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span
                className="text-2xl"
                role="img"
                aria-label="Current state icon"
              >
                📊
              </span>
              Current State of Educational Technology
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2 text-destructive">
                  Accessibility Gaps
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">•</span>
                    Visual-first interfaces with poor screen reader support
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">•</span>
                    Limited keyboard navigation capabilities
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">•</span>
                    Inadequate audio alternatives for visual content
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">•</span>
                    Complex document formats without TTS integration
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-muted-foreground">
                  Student Impact
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-muted-foreground mt-1">•</span>
                    Reduced learning engagement and outcomes
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-muted-foreground mt-1">•</span>
                    Dependence on human assistance for digital content
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-muted-foreground mt-1">•</span>
                    Limited access to contemporary educational resources
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-muted-foreground mt-1">•</span>
                    Inequality in educational technology benefits
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
