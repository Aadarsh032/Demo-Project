import { Flex, Text , Box } from '@sparrowengg/twigs-react'

const Description = (props) => {
    return (
        <Flex flexDirection="column" gap="$8" alignItems='center' css={{
            color: '$black900',
            padding: '$10',
            cursor: 'pointer',
        }}  >
            <Text css={{
                fontWeight: '$9',
                fontSize: '$xl',
            }}> {props.heading || ''} </Text>
            <Text css={{
                fontWeight: '$1',
                fontSize: '$md',
            }}> {props.paragraph || ''} </Text>

            <Flex flexDirection="column" alignItems='center'>
                <Text css={{
                    fontWeight: '$9',
                    fontSize: '$lg',
                    padding: '10px'
                }}>Genres</Text>
                <Box css={{
                    fontWeight: '$1',
                    fontSize: '$md',
                }}> {
                        props?.genres?.map((item, id) => {
                            return (
                                <Text key={id}>{item}</Text>
                            )
                        })
                    } </Box>
            </Flex>

            <Flex flexDirection="column" alignItems='center'>
                <Text css={{
                    fontWeight: '$9',
                    fontSize: '$lg',
                    padding: '10px'
                }}>Cast</Text>
                <Box css={{
                    fontWeight: '$1',
                    fontSize: '$md',
                }}>
                    {
                        props?.cast?.map((item, id) => {
                            return (
                                <Text key={id}>{`${item.cast} : ${item.name}`}</Text>
                            )
                        })
                    }
                </Box>
            </Flex>

        </Flex>
    )
}

export default Description