"use client";
import Footer from "@/components/footer/page";
import React, { useState } from "react";
import TabButton from "./tab-button";
import Header from "@/components/header/page";
import ExerciseComponent from "./exercise-component";

const StudyRecordComponent = () => <div>学習記録コンポーネント</div>;

const Page = () => {
	const [tab, setTab] = useState<"exercise" | "record">("exercise");

	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			<nav className="flex">
				<TabButton
					active={tab === "exercise"}
					onClick={() => setTab("exercise")}
				>
					問題演習
				</TabButton>
				<TabButton active={tab === "record"} onClick={() => setTab("record")}>
					学習記録
				</TabButton>
			</nav>
			<main style={{ flex: 1, padding: "2rem" }}>
				{tab === "exercise" ? <ExerciseComponent /> : <StudyRecordComponent />}
			</main>
			<Footer />
		</div>
	);
};

export default Page;
