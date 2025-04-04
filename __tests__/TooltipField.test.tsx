import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TooltipField } from '@/modules/ItineraryMakerModule/module-elements/TooltipField'

describe('TooltipField', () => {
  it('renders children without tooltip if no feedback is provided', () => {
    render(<TooltipField>Just Text</TooltipField>)
    expect(screen.getByText('Just Text')).toBeInTheDocument()
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('renders tooltip when feedback is provided', async () => {
    const user = userEvent.setup()

    render(
      <TooltipField feedback="This is a suggestion">
        <span>Hover me</span>
      </TooltipField>
    )

    const trigger = screen.getByText('Hover me')
    expect(trigger).toBeInTheDocument()

    await user.hover(trigger)
    const tooltips = await screen.findAllByText('This is a suggestion')

    const visibleTooltip = tooltips.find(
      (el) => el.getAttribute('role') !== 'tooltip'
    )

    expect(visibleTooltip).toBeVisible()
  })
})
