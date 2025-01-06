// @transform-path
import CsMagicBlackLogoSvg from "@assets/branding/neurora/neurora_logo_black_trans_1280.svg"
import clsx from "clsx"
import type { HTMLProps } from "react"

import { LOGO_SIZE_LG } from "../config"

export const CompanyLogo = ({ className, ...props }: HTMLProps<SVGSVGElement>) => (
  <CsMagicBlackLogoSvg
    className={clsx("", className)}
    height={LOGO_SIZE_LG}
    width={LOGO_SIZE_LG}
    {...props}
  />
)
