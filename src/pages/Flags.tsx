import { ArrowBackIcon, CheckCircleIcon } from "@chakra-ui/icons";
import {
	Center,
	Button,
	Card,
	CardBody,
	Flex,
	Heading,
	Image,
	SimpleGrid,
	Spinner,
	useColorModeValue,
	useToast,
	IconButton,
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverArrow,
	PopoverHeader,
	PopoverBody,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useFlagsStore } from "../data/flags";

export function Flags() {
	const toast = useToast();

	const handleAnswer = () => {
		if (selected === -1) return;
		let result = check();
		toast({
			title: `Answer was ${result ? "correct" : "incorrect"}`,
			status: result ? "success" : "error",
			duration: 3000,
			variant: "solid",
		});
		next();
	};

	// zustand
	const {
		data,
		dataIndex,
		selected,
		changeSelected,
		check,
		checkResult,
		fetch,
		fetchDone,
		next,
	} = useFlagsStore();

	useEffect(() => {
		if (!fetchDone) fetch();
	}, []);

	if (!data[dataIndex]) return <Spinner size={"xl"} m={4}></Spinner>;

	return (
		<Card
			rounded={"xl"}
			bgGradient={useColorModeValue(
				"linear(to-r, blue.100, purple.200)",
				"linear(to-r, blue.700, purple.800)",
			)}
			direction={{ base: "column", sm: "row" }}
			alignItems="center"
			overflow="hidden"
			p={2}
		>
			{/* Flag */}
			<Center
				bg={useColorModeValue("gray.100", "gray.800")}
				m={4}
				rounded={"xl"}
			>
				<Image
					m={4}
					maxW={"xs"}
					fallback={<Spinner size={"xl"} m={4}></Spinner>}
					objectFit="cover"
					src={data[dataIndex].flag}
					alt={`Unknown Flag`}
				/>
			</Center>
			{/* Flag end */}
			<CardBody>
				<Flex direction={"column"} gap={4} justifyContent="space-evenly">
					<Heading size={"md"}>What country does this flag belong to?</Heading>
					{/* Choices */}
					<SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
						{data[dataIndex].variants.map((el, i) => (
							<Button
								onClick={() => changeSelected(i)}
								key={i}
								borderColor={selected === i ? "purple.400" : "transparent"}
								borderWidth={selected === i ? 2 : 0}
							>
								{el}
							</Button>
						))}
					</SimpleGrid>
					{/* Choices end */}
					<Flex justifyContent={"center"} gap={2}>
						{/* Previous */}
						<Popover isLazy>
							<PopoverTrigger>
								<IconButton aria-label="Previous Answer Button">
									<ArrowBackIcon />
								</IconButton>
							</PopoverTrigger>
							<PopoverContent>
								<PopoverArrow />
								<PopoverHeader>
									Your answer was {checkResult ? "Correct" : "Incorrect"}
								</PopoverHeader>
								<PopoverBody>
									Are you sure you want to have that milkshake?
								</PopoverBody>
							</PopoverContent>
						</Popover>
						{/* Previous end */}

						{/* Answer button */}
						<Button
							w={"full"}
							onClick={() => handleAnswer()}
							leftIcon={<CheckCircleIcon />}
						>
							Answer
						</Button>
						{/* Answer button end */}
					</Flex>
				</Flex>
			</CardBody>
		</Card>
	);
}
