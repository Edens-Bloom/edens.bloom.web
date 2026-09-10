import Image from "next/image";

export const Logo = () => {
  return (
    <div>
      <Image src="/logo1.png" alt="Eden's Bloom Logo" width={65} height={65} />
    </div>
  );
};

export default Logo;
