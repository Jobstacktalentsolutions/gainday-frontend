
const GradientCard = () => {
    return (
        <div className="relative min-w-80 lg:h-147 lg:pb-25 lg:pt-8.75 lg:px-14 overflow-hidden rounded-3xl bg-linear-to-b from-primary-500 via-primary-700 to-primary-800 p-4 shadow-2xl">
            <div className="pointer-events-none absolute -bottom-14 -right-14 h-64 w-64 lg:w-70.5 lg:h-98 lg:rotate-[-66.004deg] rounded-full bg-[radial-gradient(circle,rgba(224,147,46,1)_0%,transparent_90%)] lg:bg-[radial-gradient(circle,rgba(224,147,46,1)_0%,transparent_100%)] lg:blur-2xl **:blur-xl" />

            <div className="relative z-10 flex flex-col gap-4 lg:h-full">
                <div className="h-20 w-full rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-inner" />

                <div className="h-72 w-full rounded-2xl bg-white p-4 shadow-lg lg:h-full">
                    {/*content*/}
                </div>
            </div>

        </div>
    );
}

export default GradientCard;