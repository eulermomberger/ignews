import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Post, { getStaticProps } from '../../pages/posts/preview/[slug]';
import { getPrismicClient } from '../../services/prismic';

const post = {
  slug: 'my-new-post',
  title: 'My new post',
  content: '<p>Post excerpt</p>',
  updatedAt: '01 de abril de 2021'
};

jest.mock('next-auth/react');
jest.mock('next/router', () => {
  return {
    useRouter: jest.fn()
  };
});
jest.mock('../../services/prismic');

describe('Post preview page', () => {
  test('renders correctly', () => {
    const useSessionMocked = jest.mocked(useSession);

    useSessionMocked.mockReturnValue({
      data: null,
      status: 'unauthenticated'
    });

    render(<Post post={post} />);

    expect(screen.getByText('My new post')).toBeInTheDocument();
    expect(screen.getByText('Post excerpt')).toBeInTheDocument();
    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument();
  });

  test('redirects user to full post when user is subscribed', async () => {
    const useSessionMocked = jest.mocked(useSession);
    const useRouterMocked = jest.mocked(useRouter);
    const pushMock = jest.fn();

    useSessionMocked.mockReturnValueOnce({
      data: {
        activeSubscription: 'fake-active-subscription',
        expires: 'fake-expires'
      },
      status: 'authenticated'
    });

    useRouterMocked.mockReturnValueOnce({
      push: pushMock
    } as any);

    render(<Post post={post} />);

    expect(pushMock).toHaveBeenCalledWith('/posts/my-new-post');
  });

  test('loads initial data', async () => {
    const getPrismicClientMocked = jest.mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: 'My new post',
          content: [{ type: 'paragraph', text: 'Post excerpt', spans: [] }]
        },
        last_publication_date: '04-01-2021'
      })
    } as any);

    const response = await getStaticProps({
      params: { slug: 'my-new-post' }
    });

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
