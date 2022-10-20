import * as React from "react";
import { dataSubArray } from "./SideDrawer.fixtures";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useTypedSelector } from "hooks/useTypeSelector";

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
  selectedNode: string;
  onClick: (id: string) => void;
}

export default function ResponsiveDrawer(props: Props) {
  const { selectedNode, onClick } = props;
  const location = useLocation();
  const { name } = useParams();

  const handleMenuItemClick = (id: string) => {
    onClick(id);
  };

  const expectedOnboarding = useTypedSelector(
    (state) => state.auth.userData.expectedOnboarding
  );

  const generateMenuItem = (item: any) => {
    const isDisabled =
      item.alwaysDisabled ||
      (item.canBeDisabled && !selectedNode) ||
      (item.requiredOnboarding &&
        !expectedOnboarding?.includes(item.requiredOnboarding));
    return (
      <>
        {
          <div
            id={item.id}
            onClick={
              isDisabled ? undefined : () => handleMenuItemClick(item.id)
            }
            style={
              location.pathname.includes(item.link)
                ? {
                    backgroundImage:
                      "linear-gradient(to right, rgba(255,255,255,0.1) , rgba(255,255,255,0))",
                    borderLeft: "5px solid #FAFAFA",
                    display: "flex",
                    textDecoration: "none",
                  }
                : {
                    textDecoration: "none",
                  }
            }
          >
            <div className="p-0" key={item.text}>
              <button
                className={`flex justify-between items-center cursor-pointer relative w-full hover:bg-gray-200 disabled:opacity-50`}
                disabled={isDisabled}
              >
                <div className="w-[50px] h-[50px] flex justify-center items-center">
                  {item.imgIcon}
                </div>
                <div className="text-[#28282E] font-medium leading-[1] text-left w-full">
                  {item.text}
                </div>
              </button>
            </div>
          </div>
        }
      </>
    );
  };
  const generateMenu = (arr: any) => {
    return (
      <>
        {arr.map((item: any) => {
          return (
            <>
              {item.type === "group" ? (
                <>
                  <div className="text-left font-medium mt-[26px] ml-[18px] text-[14px] font-[Inter]">
                    {item.text}
                  </div>
                  {item?.children?.map((menuItem: any) =>
                    generateMenuItem(menuItem)
                  )}
                </>
              ) : (
                generateMenuItem(item)
              )}
            </>
          );
        })}
      </>
    );
  };
  const drawer = (): React.ReactNode => {
    return (
      <div>
        <div className="h-[50px] bg-[#4FA198] flex-col justify-between px-[20px] py-[15px]">
          <div className="text-[16px] text-white">{name}</div>
          {generateMenu(dataSubArray)}
        </div>
      </div>
    );
  };

  return <div>{drawer()}</div>;
}
