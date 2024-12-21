interface GenerateProps {
    gen: () => Promise<void>
    data: any
}

export default function Generate({gen, data}: GenerateProps) {

    return (

        <div>
            <button onClick={gen}>
                gera
            </button>

            {
                data && (
                    console.log(data)
                )
            }

        </div>

    )

}