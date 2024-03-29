import { render, screen } from '@testing-library/react';
import Posts, { getStaticProps } from '../../pages/posts';
import { getPrismicClient } from '../../services/prismic';

const posts = [{
  slug: 'my-new-post',
  title: 'My new post',
  excerpt: 'Post excerpt',
  updatedAt: '01 de abril de 2021'
}];

jest.mock('../../services/prismic');

describe('Posts page', () => {
  test('renders correctly', () => {
    render(<Posts posts={posts} />);

    expect(screen.getByText('My new post')).toBeInTheDocument();
  });

  test('loads initial data', async () => {
    const getPrismicClientMocked = jest.mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      getAllByType: jest.fn().mockResolvedValueOnce([
        {
          uid: 'my-new-post',
          data: {
            title: 'My new post',
            content: [{ type: 'paragraph', text: 'Post excerpt' }]
          },
          last_publication_date: '04-01-2021',
        },
      ])
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [{
            slug: 'my-new-post',
            title: 'My new post',
            excerpt: 'Post excerpt',
            updatedAt: '01 de abril de 2021'
          }]
        }
      })
    );
  });
});
