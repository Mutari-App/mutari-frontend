import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Pagination } from "@/modules/ItineraryModule/module-elements/Pagination";


jest.mock('lucide-react', () => ({
    ChevronLeft: () => 'ChevronLeft',
    ChevronRightIcon: () => 'ChevronRightIcon',
}))

describe("Pagination", () => {
    const mockProps = {
        totalPages: 3,
        page: 2,
        total: 15
    }

    it("should render prev and next button", () => {
        render(<Pagination {...mockProps} />);

        expect(screen.getByTestId('prev-link')).toBeInTheDocument();
        expect(screen.getByTestId('next-link')).toBeInTheDocument();
    });

    it("should disable prev button on first page", () => {
        render(<Pagination {...mockProps} page={1} />);

        expect(screen.getByTestId('prev-btn')).toBeDisabled();
    });

    it("should disable next button on last page", () => {
        render(<Pagination {...mockProps} page={3} />);

        expect(screen.getByTestId('next-btn')).toBeDisabled();
    });

    it("should display pagination with right ellipsis format", () => {
        render(<Pagination totalPages={10} page={5} total={50} />);

        const dots = screen.getAllByText("...");
        
        const page1 = screen.getByText("1");
        const page4 = screen.getByText("4");
        const page5 = screen.getByText("5");
        const page6 = screen.getByText("6");
        const page10 = screen.getByText("10");

        const dots1 = dots[0];
        const dots2 = dots[1];

        expect(page1).toBeInTheDocument();
        expect(dots1).toBeInTheDocument();
        expect(page4).toBeInTheDocument();
        expect(page5).toBeInTheDocument();
        expect(page6).toBeInTheDocument();
        expect(dots2).toBeInTheDocument();
        expect(page10).toBeInTheDocument();
    });

    it("should have next button with href to the next page", () => {
        render(<Pagination {...mockProps} />);
        const nextButton = screen.getByTestId('next-link');

        expect(nextButton).toHaveAttribute("href", "?page=3");
    });

    it("should have prev button with href to the previous page", () => {
        render(<Pagination {...mockProps} />);
        const prevButton = screen.getByTestId('prev-link');

        expect(prevButton).toHaveAttribute("href", "?page=1");
    });
});
