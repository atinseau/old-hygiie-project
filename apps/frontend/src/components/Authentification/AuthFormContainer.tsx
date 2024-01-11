import { createVariants, pickVariant } from '@/utils/variants'
import { twMerge } from 'tailwind-merge'


const authFormContainerVariants = createVariants({
  "contained": {
    classNames: {
      base: "items-center",
      content: "flex flex-col gap-8 justify-center items-center max-w-[480px] w-full",
      header: "flex flex-col gap-2 text-center",
      headerTitle: "text-indigo-500"
    },
    colors: {
      primary: {
        headerSubTitle: "text-sm text-gray-600",
      },
      secondary: {
        headerSubTitle: "text-base text-black"
      }
    }
  },
  "full": {
    colors: {
      primary: {
        headerTitle: "text-pink-500 font-SofiaProSoft",
      },
    }
  }
})

type AuthFormContainerProps = {
  title: string
  subTitle?: string
  variant?: string
  color?: string
  className?: string // act like base className
  classNames?: {
    header?: string
    headerTitle?: string
    headerSubTitle?: string
    content?: string
  },
  children?: React.ReactNode
  footer?: React.ReactNode
}


export default function AuthFormContainer(props: AuthFormContainerProps) {

  const { classNames } = pickVariant(
    authFormContainerVariants,
    props?.variant || "contained" as any,
    props?.color || "primary" as any,
  )

  return <div className={twMerge("flex flex-col gap-8 max-w-[608px] w-full", classNames?.base, props.className)}>
    <div className={twMerge(classNames?.header, props?.classNames?.header)}>
      <h1 className={twMerge("text-xl", classNames?.headerTitle, props?.classNames?.headerTitle)}>{props.title}</h1>
      {props.subTitle && <p className={twMerge(classNames?.headerSubTitle, props.classNames?.headerSubTitle)}>{props.subTitle}</p>}
    </div>
    <div className={twMerge("flex flex-col gap-8 w-full", classNames?.content, props?.classNames?.content)}>
      {props.children}
      {props.footer}
    </div>
  </div>
}