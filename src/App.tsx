import { Center, Container, Flex } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import { Info } from "./components/Info";
import { Nav } from "./components/Nav";
import { Capitals } from "./pages/Capitals";
import { Flags } from "./pages/Flags";
import { Main } from "./pages/Main";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<Container maxW="container.lg">
				<Flex
					sx={{ minHeight: "100vh" }}
					direction={"column"}
					h={"full"}
					justifyContent={"space-between"}
					gap={4}
					py={2}
				>
					{/* Header */}
					<Nav />
					{/* Main */}
					<Center>
						<Routes>
							<Route path={"/"} element={<Main></Main>} />
							<Route path={"/capitals"} element={<Capitals></Capitals>} />
							<Route path={"/flags"} element={<Flags></Flags>} />
						</Routes>
					</Center>
					{/* Footer */}
					<Info />
				</Flex>
			</Container>
		</QueryClientProvider>
	);
}

export default App;
