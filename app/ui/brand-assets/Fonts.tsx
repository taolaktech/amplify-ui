import SelectInput from "../form/SelectInput";

const fontList = [
  "Helvetica",
  "Arial",
  "Open Sans",
  "Poppins",
  "Lato",
  "Roboto",
  "Montserrat",
  "Inter",
  "Noto Sans",
  "DM Sans",
  "Times New Roman",
  "Georgia",
  "Merriweather",
  "Playfair Display",
  "Cormorant Garamon",
  "Verdana",
  "Trebuchet MS",
  "Tahoma",
  "Geneva",
  "Palatino Linotype",
  "Book Antiqua",
  "Courier New",
  "Lucida Console",
];

export default function Fonts({
  primaryFont,
  secondaryFont,
  handleFontChange,
}: {
  primaryFont: string | null;
  secondaryFont: string | null;
  handleFontChange: (key: string, value: string) => void;
}) {
  const handleSetPrimaryFont = (font: string) => {
    handleFontChange("primaryFont", font);
  };

  const handleSetSecondaryFont = (font: string) => {
    handleFontChange("secondaryFont", font);
  };

  return (
    <div className="">
      <div className="text-heading font-medium text-sm mb-4">3. Font</div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full">
          <SelectInput
            placeholder="Select primary font"
            label="Primary Font"
            options={fontList}
            background="rgba(230, 230, 230, 0.25)"
            borderless
            setSelected={handleSetPrimaryFont}
            selected={primaryFont}
            large
          />
        </div>
        <div className="w-full">
          <SelectInput
            placeholder="Select secondary font"
            label="Secondary Font (Optional)"
            options={fontList}
            background="rgba(230, 230, 230, 0.25)"
            borderless
            setSelected={handleSetSecondaryFont}
            selected={secondaryFont}
            large
          />
        </div>
      </div>
    </div>
  );
}
