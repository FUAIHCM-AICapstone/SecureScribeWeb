type PageProps = { params: { id: string } };

export default async function MeetingDetailPage({ params }: PageProps) {
    const { id } = params;
    return (
        <>
            <main className='overflow-x-hidden px-3 lg:px-32'>
                <h1 className='text-2xl font-semibold'>Meeting Detail</h1>
                <p className='mt-2 text-sm text-gray-500'>ID: {id}</p>
            </main>
        </>
    );
}


