import { FC, SVGProps } from 'react';

export const IconSad: FC<SVGProps<SVGSVGElement>> = ({ width = '100%', height = '100%', ...props }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" width={width} height={height}>
      <path fill="url(#sad1)" d="M16 8A8 8 0 1 1-.001 8 8 8 0 0 1 16 8"></path>
      <path
        fill="url(#sad2)"
        d="M5.333 12.765c0 .137.094.235.25.235.351 0 .836-.625 2.417-.625s2.067.625 2.417.625c.156 0 .25-.098.25-.235C10.667 12.368 9.828 11 8 11c-1.828 0-2.667 1.368-2.667 1.765Z"
      ></path>
      <path
        fill="url(#sad3)"
        d="M3.599 8.8c0-.81.509-1.466 1.134-1.466.627 0 1.134.656 1.134 1.466 0 .338-.09.65-.238.898a.492.492 0 0 1-.301.225c-.14.037-.353.077-.595.077-.243 0-.453-.04-.595-.077a.49.49 0 0 1-.3-.225 1.741 1.741 0 0 1-.24-.898Zm6.534 0c0-.81.508-1.466 1.133-1.466.627 0 1.134.656 1.134 1.466 0 .338-.09.65-.238.898a.49.49 0 0 1-.301.225c-.39.101-.8.101-1.19 0a.49.49 0 0 1-.3-.225 1.74 1.74 0 0 1-.238-.898Z"
      ></path>
      <path
        fill="#000000"
        d="M3.599 8.8c0-.81.509-1.466 1.134-1.466.627 0 1.134.656 1.134 1.466 0 .338-.09.65-.238.898a.492.492 0 0 1-.301.225c-.14.037-.353.077-.595.077-.243 0-.453-.04-.595-.077a.49.49 0 0 1-.3-.225 1.741 1.741 0 0 1-.24-.898Zm6.534 0c0-.81.508-1.466 1.133-1.466.627 0 1.134.656 1.134 1.466 0 .338-.09.65-.238.898a.49.49 0 0 1-.301.225c-.39.101-.8.101-1.19 0a.49.49 0 0 1-.3-.225 1.74 1.74 0 0 1-.238-.898Z"
        filter="url(#sad4)"
        className="color000 svgShape"
      ></path>
      <path
        fill="#4e506a"
        d="M4.616 7.986c.128.125.136.372.017.55-.12.179-.32.223-.448.097-.128-.125-.135-.372-.017-.55.12-.18.32-.222.448-.097Zm6.489 0c.128.125.136.372.018.55-.12.179-.32.223-.45.097-.127-.125-.134-.372-.015-.55.119-.18.319-.222.447-.097Z"
        className="color4E506A svgShape"
      ></path>
      <path
        fill="url(#sad5)"
        d="M4.157 5.153c.332-.153.596-.22.801-.22.277 0 .451.12.55.307.175.329.096.4-.198.459-1.106.224-2.217.942-2.699 1.39-.3.28-.589-.03-.436-.274.154-.244.774-1.105 1.982-1.662Zm6.335.087c.1-.187.273-.306.55-.306.206 0 .47.066.801.219 1.208.557 1.828 1.418 1.981 1.662.153.244-.134.554-.435.274-.483-.448-1.593-1.166-2.7-1.39-.294-.058-.37-.13-.197-.46Z"
      ></path>
      <path
        fill="url(#sad6)"
        d="M13.5 16c-.828 0-1.5-.748-1.5-1.671 0-.922.356-1.545.643-2.147.598-1.258.716-1.432.857-1.432.141 0 .259.174.857 1.432.287.602.643 1.225.643 2.147 0 .923-.672 1.671-1.5 1.671Z"
      ></path>
      <path
        fill="url(#sad7)"
        d="M13.5 13.606c-.328 0-.594-.296-.594-.66 0-.366.141-.613.255-.852.236-.498.283-.566.34-.566.055 0 .102.068.338.566.114.24.255.486.255.851s-.266.661-.594.661"
      ></path>
      <defs>
        <linearGradient id="sad1" x1="8" x2="8" y1="1.64" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor="#feea70" className="stopColorFEEA70 svgShape"></stop>
          <stop offset="1" stopColor="#f69b30" className="stopColorF69B30 svgShape"></stop>
        </linearGradient>
        <linearGradient id="sad2" x1="8" x2="8" y1="11" y2="13" gradientUnits="userSpaceOnUse">
          <stop stopColor="#472315" className="stopColor472315 svgShape"></stop>
          <stop offset="1" stopColor="#8b3a0e" className="stopColor8B3A0E svgShape"></stop>
        </linearGradient>
        <linearGradient id="sad3" x1="7.999" x2="7.999" y1="7.334" y2="10" gradientUnits="userSpaceOnUse">
          <stop stopColor="#191a33" className="stopColor191A33 svgShape"></stop>
          <stop offset=".872" stopColor="#3b426a" className="stopColor3B426A svgShape"></stop>
        </linearGradient>
        <linearGradient id="sad5" x1="8" x2="8" y1="4.934" y2="7.199" gradientUnits="userSpaceOnUse">
          <stop stopColor="#e78e0d" className="stopColorE78E0D svgShape"></stop>
          <stop offset="1" stopColor="#cb6000" className="stopColorCB6000 svgShape"></stop>
        </linearGradient>
        <linearGradient id="sad6" x1="13.5" x2="13.5" y1="15.05" y2="11.692" gradientUnits="userSpaceOnUse">
          <stop stopColor="#35cafc" className="stopColor35CAFC svgShape"></stop>
          <stop offset="1" stopColor="#007edb" className="stopColor007EDB svgShape"></stop>
        </linearGradient>
        <linearGradient id="sad7" x1="13.5" x2="13.5" y1="11.528" y2="13.606" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6ae1ff" stopOpacity=".287" className="stopColor6AE1FF svgShape"></stop>
          <stop offset="1" stopColor="#a8e3ff" stopOpacity=".799" className="stopColorA8E3FF svgShape"></stop>
        </linearGradient>
        <filter
          id="sad4"
          width="8.801"
          height="2.666"
          x="3.599"
          y="7.334"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          ></feColorMatrix>
          <feOffset>
            <feGaussianBlur stdDeviation=".5"></feGaussianBlur>
            <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"></feComposite>
            <feColorMatrix values="0 0 0 0 0.0411227 0 0 0 0 0.0430885 0 0 0 0 0.0922353 0 0 0 0.819684 0"></feColorMatrix>
            <feBlend in2="shape" result="effect1_innerShadow"></feBlend>
          </feOffset>
        </filter>
      </defs>
    </svg>
  );
};
