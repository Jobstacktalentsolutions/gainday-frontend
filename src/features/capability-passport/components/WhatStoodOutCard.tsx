const WhatStoodOutCard = ({ text }: { text: string }) => {
    return (
        <section className="flex w-full flex-col gap-6 rounded-xl bg-white px-6 py-8">
            <h2 className="text-sm uppercase text-primary-500">What stood out</h2>
            <p className="text-base leading-6 text-neutral-500">{text}</p>
        </section>
    );
};

export default WhatStoodOutCard;