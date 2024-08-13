"use client"

import { MenuIcon } from "lucide-react"
import Link from "next/link"
import React, { PropsWithChildren } from "react"

import { IconContainer } from "@cs-magic/react-ui/dist/components/icon-container.js"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@cs-magic/react-ui/dist/shadcn/ui/navigation-menu.js"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@cs-magic/react-ui/dist/shadcn/ui/sheet.js"
import { cn } from "@cs-magic/react-ui/shadcn/utils"

import { BrandingTitle } from "./branding-title"
import { UserButton } from "./header-user"

const menus = [
  {
    href: "/card/new",
    title: "新建卡片",
  },
  {
    href: "/card/gen",
    title: "渲染卡片",
  },
  {
    href: "/dashboard",
    title: "飞脑控制台",
  },
]

const Menus = () => (
  <>
    {menus.map((m, index) => (
      <LinkItem href={m.href} key={index}>
        {m.title}
      </LinkItem>
    ))}
  </>
)

export const Header = () => {
  return (
    <div
      className={
        "flex w-full shrink-0 items-center justify-between gap-2 px-6 py-4"
      }
    >
      <div className={"flex items-center"}>
        <MobileConversations />
        <BrandingTitle withDescription />
      </div>

      <NavigationMenu className={"hidden sm:flex"}>
        <NavigationMenuList>
          <Menus />
        </NavigationMenuList>
      </NavigationMenu>

      <div className={"ml-auto flex shrink-0 items-center gap-2"}>
        {/*<Apps />*/}

        <UserButton />
      </div>
    </div>
  )
}

const MobileConversations = () => (
  <Sheet>
    <SheetTrigger asChild>
      <IconContainer
        className={"mr-2 h-8 w-8 text-primary-foreground sm:hidden"}
      >
        <MenuIcon />
      </IconContainer>
    </SheetTrigger>

    <SheetContent side={"left"}>
      <NavigationMenu>
        <NavigationMenuList className={"flex-col"}>
          <Menus />
        </NavigationMenuList>
      </NavigationMenu>
    </SheetContent>
  </Sheet>
)

const LinkItem = ({ href, children }: { href: string } & PropsWithChildren) => {
  return (
    <NavigationMenuItem className={"w-full"}>
      <Link href={href} legacyBehavior passHref className={"w-full"}>
        <NavigationMenuLink
          className={cn(navigationMenuTriggerStyle(), "w-full text-nowrap")}
        >
          {children}
        </NavigationMenuLink>
      </Link>
    </NavigationMenuItem>
  )
}