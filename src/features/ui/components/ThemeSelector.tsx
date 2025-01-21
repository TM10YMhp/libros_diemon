import { useState } from "react";

function ThemeSelector() {
  const [theme, setTheme] = useState(
    () => window.localStorage.getItem("theme") || "default",
  );

  const themes = [
    { value: "default", label: "Default" },
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "retro", label: "Retro" },
    { value: "cyberpunk", label: "Cyberpunk" },
    { value: "valentine", label: "Valentine" },
    { value: "aqua", label: "Aqua" },
  ];

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-sm btn-outline m-1">
        Theme {document.documentElement.getAttribute("theme")}
        <svg
          width="12px"
          height="12px"
          className="inline-block h-2 w-2 fill-current opacity-60"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 2048 2048"
        >
          <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
        </svg>
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content bg-base-300 rounded-box z-[1] w-52 p-2 shadow-2xl"
      >
        {themes.map((item) => (
          <li key={item.value}>
            <input
              type="radio"
              name="theme-dropdown"
              className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
              aria-label={item.label}
              value={item.value}
              onChange={(event) => {
                const value = event.target.value;
                window.localStorage.setItem("theme", value);
                setTheme(value);
              }}
              defaultChecked={item.value === theme}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ThemeSelector;
