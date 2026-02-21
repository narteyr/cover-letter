import { Tag, TagGroup, TagList } from "@/components/base/tags/tags";
 
export const DefaultDemo = () => {
    return (
        <TagGroup label="Tags" size="md">
            <TagList className="flex gap-4">
                <Tag>Label</Tag>
                <Tag avatarSrc="https://www.untitledui.com/images/flags/AU.svg">Label</Tag>
                <Tag avatarSrc="https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80">Label</Tag>
                <Tag dot={true}>Label</Tag>
            </TagList>
        </TagGroup>
    );
};

