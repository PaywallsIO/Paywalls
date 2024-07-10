import { ChildFunctionProps, FieldProps, Field as KeaField } from 'kea-forms'
import React, { ReactElement } from 'react'

export function Field({ children, name, label, ...props }: FieldProps): ReturnType<typeof KeaField> {
    const template: FieldProps['template'] = ({ label, kids, error }) => {
        const kid = React.cloneElement(kids as any, {
            value: (children as ReactElement).props.value,
        })

        return (
            <>
                {kid as any}
            </>
        )
    }
    return <KeaField {...props} children={children} name={name} label={label} template={template} noStyle />
}