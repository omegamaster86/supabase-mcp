import Link from "next/link";
import React from "react";

const Footer = () => {
	return (
		<footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-8 bg-black">
			<div className="flex gap-8 text-white">
				<Link href="#logout">ログアウト</Link>
				<Link href="#terms">利用規約</Link>
				<Link href="#law">特定取引に関する法律に基づく表記</Link>
				<Link href="#privacy">プライバシーポリシー</Link>
			</div>
		</footer>
	);
};

export default Footer;
