"use client";
import { useEffect } from "react";
import { animate } from "motion";

export default function CompletionBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const shapes = document.querySelectorAll("#verified-bg .big svg g");

    shapes.forEach((shape) => {
      const randomValue = Math.random() * 2 - 1;

      animate(
        shape,
        { x: 30 * randomValue, y: 30 },
        { duration: 3.5, ease: "easeInOut" }
      );
    });

    const shapesSmall = document.querySelectorAll("#verified-bg .small svg g");

    shapesSmall.forEach((shape) => {
      const randomValue = Math.random() * 2 - 1;

      animate(
        shape,
        { x: 13 * randomValue, y: -13 },
        { duration: 3.5, ease: "easeInOut" }
      );
    });
  }, []);
  return (
    <div id="verified-bg">
      <div className="h-[316px] max-h-[30vh] w-full max-w-screen lg:hidden small">
        <svg
          className="w-full"
          height="316"
          viewBox="0 0 430 316"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g>
            <rect
              x="386.547"
              y="306.836"
              width="11.6482"
              height="11.6482"
              rx="5"
              transform="rotate(155 386.547 306.836)"
              fill="#E8D9F9"
            />
          </g>
          <g>
            <rect
              x="13.8955"
              y="30.7564"
              width="11.6482"
              height="11.6482"
              rx="5"
              transform="rotate(-25 13.8955 30.7564)"
              fill="#E8D9F9"
            />
          </g>
          <g>
            <rect
              x="150.346"
              y="86.1428"
              width="16.3075"
              height="16.3075"
              rx="5"
              transform="rotate(155 150.346 86.1428)"
              fill="#BFE6CF"
            />
          </g>
          <g>
            <rect
              x="192.088"
              y="6.91428"
              width="16.3075"
              height="16.3075"
              rx="5"
              transform="rotate(-25 192.088 6.91428)"
              fill="#BFE6CF"
            />
          </g>
          <g>
            <rect
              x="28.1689"
              y="167.577"
              width="11.6482"
              height="11.6482"
              rx="5"
              transform="rotate(155 28.1689 167.577)"
              fill="#E8D9F9"
            />
          </g>
          <g>
            <rect
              x="372.272"
              y="170.015"
              width="11.6482"
              height="11.6482"
              rx="5"
              transform="rotate(-25 372.272 170.015)"
              fill="#E8D9F9"
            />
          </g>
          <g>
            <rect
              x="115.168"
              y="142.989"
              width="9.31857"
              height="9.31857"
              rx="4.65929"
              transform="rotate(155 115.168 142.989)"
              fill="#E8D9F9"
            />
          </g>
          <g>
            <rect
              x="285.273"
              y="194.603"
              width="9.31857"
              height="9.31857"
              rx="4.65929"
              transform="rotate(-25 285.273 194.603)"
              fill="#E8D9F9"
            />
          </g>
          <g>
            <rect
              x="300.375"
              y="114.513"
              width="16.3075"
              height="16.3075"
              rx="5"
              transform="rotate(155 300.375 114.513)"
              fill="#E8D9F9"
            />
          </g>
          <g>
            <rect
              x="100.065"
              y="223.079"
              width="16.3075"
              height="16.3075"
              rx="5"
              transform="rotate(-25 100.065 223.079)"
              fill="#E8D9F9"
            />
          </g>
          <g>
            <rect
              x="15.7695"
              y="102.089"
              width="16.3075"
              height="16.3075"
              rx="5"
              transform="rotate(155 15.7695 102.089)"
              fill="#BFE6CF"
            />
          </g>
          <g>
            <rect
              x="384.671"
              y="235.504"
              width="16.3075"
              height="16.3075"
              rx="5"
              transform="rotate(-25 384.671 235.504)"
              fill="#BFE6CF"
            />
          </g>
          <g>
            <path
              d="M429.343 104.137L427.008 90.8907L439.647 95.4909L429.343 104.137Z"
              fill="#E8D9F9"
            />
          </g>
          <g>
            <path
              d="M346.247 37.6974L333.001 35.3618L341.646 25.0584L346.247 37.6974Z"
              fill="#BFE6CF"
            />
          </g>
          <g>
            <path
              d="M54.1937 299.894L67.4396 302.23L58.7939 312.534L54.1937 299.894Z"
              fill="#BFE6CF"
            />
          </g>
          <g>
            <circle
              cx="171.08"
              cy="213.551"
              r="5.82411"
              transform="rotate(180 171.08 213.551)"
              fill="#EAF7EF"
            />
          </g>
          <g>
            <circle cx="229.362" cy="124.041" r="5.82411" fill="#EAF7EF" />
          </g>
        </svg>
      </div>
      <div className="h-[364.63px] max-h-[34vh] w-full hidden lg:block big">
        <svg
          className="w-full h-full"
          // height="366"
          viewBox="0 0 884 366"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="rect1">
            <rect
              x="657.136"
              y="355.05"
              width="13.4493"
              height="13.4493"
              rx="5"
              transform="rotate(155 657.136 355.05)"
              fill="#E8D9F9"
            />
          </g>
          <g>
            <rect
              x="226.864"
              y="36.2827"
              width="13.4493"
              height="13.4493"
              rx="5"
              transform="rotate(-25 226.864 36.2827)"
              fill="#E8D9F9"
            />
          </g>
          <g>
            <rect
              x="870.111"
              y="344.472"
              width="6.72465"
              height="6.72465"
              rx="3.36232"
              transform="rotate(155 870.111 344.472)"
              fill="#E0F3E8"
            />
          </g>
          <g>
            <rect
              x="13.8877"
              y="46.8601"
              width="6.72465"
              height="6.72465"
              rx="3.36232"
              transform="rotate(-25 13.8877 46.8601)"
              fill="#E0F3E8"
            />
          </g>
          <g>
            <rect
              x="384.412"
              y="100.233"
              width="18.829"
              height="18.829"
              rx="5"
              transform="rotate(155 384.412 100.233)"
              fill="#BFE6CF"
            />
          </g>
          <g>
            <rect
              x="432.608"
              y="8.75394"
              width="18.829"
              height="18.829"
              rx="5"
              transform="rotate(-25 432.608 8.75394)"
              fill="#BFE6CF"
            />
          </g>
          <g>
            <rect
              x="754.448"
              y="246.556"
              width="10.7594"
              height="10.7594"
              rx="5"
              transform="rotate(155 754.448 246.556)"
              fill="#E0F3E8"
            />
          </g>
          <g>
            <rect
              x="129.551"
              y="144.776"
              width="10.7594"
              height="10.7594"
              rx="5"
              transform="rotate(-25 129.551 144.776)"
              fill="#E0F3E8"
            />
          </g>
          <g>
            <rect
              x="243.345"
              y="194.259"
              width="13.4493"
              height="13.4493"
              rx="5"
              transform="rotate(155 243.345 194.259)"
              fill="#E8D9F9"
            />
          </g>
          <g>
            <rect
              x="640.655"
              y="197.074"
              width="13.4493"
              height="13.4493"
              rx="5"
              transform="rotate(-25 640.655 197.074)"
              fill="#E8D9F9"
            />
          </g>
          <g>
            <rect
              x="343.796"
              y="165.869"
              width="10.7594"
              height="10.7594"
              rx="5"
              transform="rotate(155 343.796 165.869)"
              fill="#E8D9F9"
            />
          </g>
          <g>
            <rect
              x="540.204"
              y="225.464"
              width="10.7594"
              height="10.7594"
              rx="5"
              transform="rotate(-25 540.204 225.464)"
              fill="#E8D9F9"
            />
          </g>
          <g>
            <rect
              x="883.113"
              y="151.555"
              width="6.72465"
              height="6.72465"
              rx="3.36232"
              transform="rotate(155 883.113 151.555)"
              fill="#E0F3E8"
            />
          </g>
          <g>
            <rect
              x="0.886719"
              y="239.778"
              width="6.72465"
              height="6.72465"
              rx="3.36232"
              transform="rotate(-25 0.886719 239.778)"
              fill="#E0F3E8"
            />
          </g>
          <g>
            <rect
              x="557.641"
              y="132.99"
              width="18.829"
              height="18.829"
              rx="5"
              transform="rotate(155 557.641 132.99)"
              fill="#E8D9F9"
            />
          </g>
          <g>
            <rect
              x="326.358"
              y="258.342"
              width="18.829"
              height="18.829"
              rx="5"
              transform="rotate(-25 326.358 258.342)"
              fill="#E8D9F9"
            />
          </g>
          <g>
            <path
              d="M831.014 56.2726C832.181 58.7753 831.098 61.7502 828.595 62.9173L827.907 63.2382C825.404 64.4052 822.43 63.3225 821.262 60.8198L820.942 60.1315C819.775 57.6288 820.857 54.6539 823.36 53.4869L824.048 53.1659C826.551 51.9989 829.526 53.0816 830.693 55.5843L831.014 56.2726Z"
              fill="#BFE6CF"
            />
          </g>
          <g>
            <path
              d="M52.9861 335.06C51.8191 332.557 52.9019 329.582 55.4046 328.415L56.0929 328.094C58.5956 326.927 61.5705 328.01 62.7375 330.512L63.0585 331.201C64.2255 333.703 63.1427 336.678 60.64 337.845L59.9517 338.166C57.449 339.333 54.4741 338.251 53.3071 335.748L52.9861 335.06Z"
              fill="#BFE6CF"
            />
          </g>
          <g>
            <rect
              x="15.1846"
              y="151.523"
              width="10.7594"
              height="10.7594"
              rx="5"
              transform="rotate(155 15.1846 151.523)"
              fill="#E8D9F9"
            />
          </g>
          <g>
            <rect
              x="868.815"
              y="239.809"
              width="10.7594"
              height="10.7594"
              rx="5"
              transform="rotate(-25 868.815 239.809)"
              fill="#E8D9F9"
            />
          </g>
          <g>
            <rect
              x="229.029"
              y="118.645"
              width="18.829"
              height="18.829"
              rx="5"
              transform="rotate(155 229.029 118.645)"
              fill="#BFE6CF"
            />
          </g>
          <g>
            <rect
              x="654.971"
              y="272.688"
              width="18.829"
              height="18.829"
              rx="5"
              transform="rotate(-25 654.971 272.688)"
              fill="#BFE6CF"
            />
          </g>
          <g>
            <path
              d="M706.551 121.009L703.854 105.715L718.448 111.027L706.551 121.009Z"
              fill="#E8D9F9"
            />
          </g>
          <g>
            <path
              d="M177.449 270.323L180.146 285.617L165.552 280.305L177.449 270.323Z"
              fill="#E8D9F9"
            />
          </g>
          <g>
            <path
              d="M610.606 44.2969L595.312 41.6002L605.294 29.7036L610.606 44.2969Z"
              fill="#BFE6CF"
            />
          </g>
          <g>
            <path
              d="M273.394 347.036L288.688 349.732L278.706 361.629L273.394 347.036Z"
              fill="#BFE6CF"
            />
          </g>
          <g>
            <circle
              cx="408.353"
              cy="247.341"
              r="6.72465"
              transform="rotate(180 408.353 247.341)"
              fill="#EAF7EF"
            />
          </g>
          <g>
            <circle cx="475.647" cy="143.992" r="6.72465" fill="#EAF7EF" />
          </g>
          <g>
            <circle
              cx="56.4299"
              cy="265.722"
              r="11.2078"
              transform="rotate(180 56.4299 265.722)"
              fill="#BFE6CF"
            />
          </g>
          <g>
            <circle cx="827.57" cy="125.611" r="11.2078" fill="#BFE6CF" />
          </g>
        </svg>
      </div>
      <div>{children}</div>
    </div>
  );
}
