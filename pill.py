from PIL import Image, ImageDraw, ImageFont

def create_card_image(rank, suit):
    width, height = 200, 300
    image = Image.new('RGBA', (width, height), (255, 255, 255, 0))
    draw = ImageDraw.Draw(image)

    # Draw the card background
    draw.rectangle([0, 0, width, height], outline="black", width=2)

    # Add text for rank and suit
    font = ImageFont.load_default()
    text = f"{rank} of {suit}"
    text_width, text_height = draw.textsize(text, font=font)
    draw.text(((width - text_width) / 2, (height - text_height) / 2), text, font=font, fill="black")

    # Save the image
    image.save(f"{rank}_of_{suit}.png")

# Example call
create_card_image('Ace', 'Spades')
