import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import exploreFeatureImage from "../../../../../../../public/assets/landingpage/explore-featured.png";
import heroIcon1 from "../../../../../../../public/assets/product-pages/publish/hero-icon-1.png";
import heroIcon2 from "../../../../../../../public/assets/product-pages/publish/hero-icon-2.png";

export const PublishUpsellCard: React.FC = () => {
  return (
    <div className="flex gap-10 rounded-xl border border-border bg-card p-8 shadow-lg md:p-10">
      <div className="flex flex-col gap-6">
        <h2 className="font-bold text-3xl tracking-tighter">
          Accelerate your protocol's growth
        </h2>

        <p className="text-muted-foreground">
          Publishing your contract is the best way to get your contracts in
          front of our 70k+ community of web3 developers.
        </p>

        <div className="flex gap-2">
          <Image alt="" className="hidden size-6 md:block" src={heroIcon1} />

          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">
              Save development time.{" "}
            </span>
            Focus on protocol development and save time by not having to build
            middleware layer yourself.
          </p>
        </div>

        <div className="flex gap-2">
          <Image alt="" className="hidden size-6 md:block" src={heroIcon2} />
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">
              Shareable landing page.{" "}
            </span>
            By publishing your contract, your contracts become easily shareable
            with a landing page for your contract.
          </p>
        </div>

        <div className="mt-auto flex gap-2 pt-4">
          <Button asChild>
            <Link href="/contact-us" rel="noopener noreferrer" target="_blank">
              Get In Touch
            </Link>
          </Button>

          <Button asChild variant="outline">
            <Link
              href="https://portal.thirdweb.com/contracts/publish/overview"
              rel="noopener noreferrer"
              target="_blank"
            >
              Learn More
            </Link>
          </Button>
        </div>
      </div>
      <Image
        alt=""
        className="hidden w-[40%] grayscale invert md:block dark:filter-none"
        draggable={false}
        src={exploreFeatureImage}
      />
    </div>
  );
};
