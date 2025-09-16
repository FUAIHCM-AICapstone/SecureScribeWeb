type PageProps = { params: Promise<{ id: string }> };

export default async function ProjectDetailPage({ params }: PageProps) {
    const { id } = await params;
    return (
        <>
            <main className='overflow-x-hidden px-3 lg:px-32'>
                <h1 className='text-2xl font-semibold'>Project Detail</h1>
                <p className='mt-2 text-sm text-gray-500'>ID: {id}</p>
            </main>
        </>
    );
}


