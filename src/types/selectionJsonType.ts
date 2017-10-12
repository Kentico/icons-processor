export type SelectionJson = {
    readonly icons: Array<IconItem>;
}

export type IconItem = {
    readonly icon: IconDetail;
    readonly properties: IconItemProperty;
}

type IconDetail = {
    readonly tags: Array<string>;
}

type IconItemProperty = {
    readonly name: string;
    readonly code: number;
}
