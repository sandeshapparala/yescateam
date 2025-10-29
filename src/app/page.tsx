import YescaHome from "../components/YescaHome";
import Link from "next/link";
import {ThemeToggle} from "@/components/ThemeToggle";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <>
      <div className="fixed top-4 right-4 z-50 flex gap-3">
        <ThemeToggle />
        <Link
          href="/home"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-primary/90 transition-colors shadow-md flex items-center h-12"
        >
          View Gallery
        </Link>
      </div>
      <YescaHome />

      {/* Registration Section */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Join YC26 Camp
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose your registration type and be part of this transformative experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Normal Registration */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Normal Registration</CardTitle>
                <CardDescription>
                  Standard camp registration for youth participants
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-2xl font-bold text-primary mb-4">₹300 - ₹1000</div>
                <Link href="/register?type=normal">
                  <Button className="w-full">
                    Register Now
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Faithbox Registration */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Faithbox Registration</CardTitle>
                <CardDescription>
                  Special registration including faithbox materials
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-2xl font-bold text-primary mb-4">₹50 - ₹1000</div>
                <Link href="/register?type=faithbox">
                  <Button className="w-full">
                    Register Now
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Kids Registration */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Kids Registration</CardTitle>
                <CardDescription>
                  Special registration for children participants
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-2xl font-bold text-primary mb-4">₹300 - ₹1000</div>
                <Link href="/register/kids">
                  <Button className="w-full">
                    Register Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
