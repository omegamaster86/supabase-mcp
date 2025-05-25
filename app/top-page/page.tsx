"use client";
import Footer from "@/components/footer/page";
import Header from "@/components/header/page";
import React, { useState } from "react";
import ExerciseComponent from "./exercise-component";
import TabButton from "./tab-button";

const StudyRecordComponent = () => <div>学習記録コンポーネント</div>;

const Page = () => {
	const [tab, setTab] = useState<"exercise" | "record">("exercise");

	return (
		<div className="flex flex-col w-full">
			<div className="flex flex-col max-w-5xl ">
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
				<main>
					{tab === "exercise" ? (
						<ExerciseComponent />
					) : (
						<StudyRecordComponent />
					)}
				</main>
				<Footer />
			</div>
		</div>
	);
};

export default Page;
