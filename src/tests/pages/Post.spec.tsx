import { render, screen } from '@testing-library/react';
import { getSession } from 'next-auth/react';
import Post, { getServerSideProps } from '../../pages/posts/[slug]';
import { getPrismicClient } from '../../services/prismic';

const post = {
  slug: 'my-new-post',
  title: 'My new post',
  content: '<p>Post excerpt</p>',
  updatedAt: '01 de abril de 2021'
};

jest.mock('next-auth/react');
jest.mock('../../services/prismic');

describe('Post page', () => {
  test('renders correctly', () => {
    render(<Post post={post} />);

    expect(screen.getByText('My new post')).toBeInTheDocument();
    expect(screen.getByText('Post excerpt')).toBeInTheDocument();
  });

  test('redirects user if no subscription is found', async () => {
    const getSessionMocked = jest.mocked(getSession);

    getSessionMocked.mockResolvedValueOnce(null);

    const response = await getServerSideProps({
      req: {
        cookies: {}
      },
      params: {
        slug: 'my-new-post'
      }
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: '/posts/preview/my-new-post',
        })
      })
    );
  });

  test('loads initial data', async () => {
    const getSessionMocked = jest.mocked(getSession);
    const getPrismicClientMocked = jest.mocked(getPrismicClient);

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription'
    } as any);

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: 'My new post',
          content: [{ type: 'paragraph', text: 'Post excerpt', spans: [] }]
        },
        last_publication_date: '04-01-2021'
      })
    } as any);

    const response = await getServerSideProps({
      req: {
        cookies: {}
      },
      params: {
        slug: 'my-new-post'
      }
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: expect.objectContaining({
          post: expect.objectContaining({
            slug: 'my-new-post',
            title: 'My new post',
            content: '<p>Post excerpt</p>',
            updatedAt: '01 de abril de 2021'
          })
        })
      })
    );
  });
});
