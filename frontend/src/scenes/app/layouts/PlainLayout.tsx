import { Notifications } from '@mantine/notifications'

interface AppLayoutProps {
    children: React.ReactNode
}

const PlainLayout = ({ children }: AppLayoutProps): JSX.Element => {
    return (
        <>
            <Notifications position="bottom-right" zIndex={1000} />
            {children}
        </>
    )
}

export default PlainLayout;