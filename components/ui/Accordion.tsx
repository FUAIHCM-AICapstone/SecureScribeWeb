import React from 'react';
import { Accordion as FAccordion, AccordionHeader, AccordionItem, AccordionPanel } from '@fluentui/react-components';

export interface AccordionItemData {
    id: string;
    header: React.ReactNode;
    content: React.ReactNode;
}

interface AccordionProps {
    items: AccordionItemData[];
    multiple?: boolean;
    defaultOpenItems?: string[];
    openItems?: string[];
    onToggle?: (openItems: string[]) => void;
}

const Accordion: React.FC<AccordionProps> = ({ items, multiple = false, defaultOpenItems, openItems, onToggle }) => {
    return (
        <FAccordion
            multiple={multiple}
            defaultOpenItems={defaultOpenItems}
            openItems={openItems}
            onToggle={(_, data) => onToggle?.(Array.isArray(data.openItems) ? (data.openItems as string[]) : [data.openItems as string])}
        >
            {items.map((it) => (
                <AccordionItem key={it.id} value={it.id}>
                    <AccordionHeader>{it.header}</AccordionHeader>
                    <AccordionPanel>{it.content}</AccordionPanel>
                </AccordionItem>
            ))}
        </FAccordion>
    );
};

export default Accordion;


